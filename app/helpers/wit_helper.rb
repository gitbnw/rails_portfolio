module WitHelper

	class WitExtension
		def initialize
			access_token = "H54ADICW2CDDBJZI2C3PX7BGG5Z7HVS3"
			@responses = []
			actions = {
				send: -> (request, response) {
				  WitExtension.nonsenseCheck request, response
					@responses << response
				},
				getJobs: -> (request) {
					context = request['context']
					entities = request['entities']
					jobHistory = getJobs()
					context['jobHistory'] = jobHistory
					return context
				},
				getProgSkills: -> (request) {
					context = request['context']
					entities = request['entities']
					progStr = getProgSkills()
					context['progStr'] = progStr
					return context
				},
				getDances: -> (request) {
					context = request['context']
					entities = request['entities']
					danceStr = getDances()
					context['danceStr'] = danceStr
					return context
				},
				getJobSums: -> (request) {
					context = request['context']
					entities = request['entities']
					jobSummary = getJobSums(request['entities'])
					context['jobSummary'] = jobSummary
					return context
				},
				cleanUp: -> (request) {
					context = Hash.new
					return context
				},
				getClever: -> (request) {
					context = request['context']
					entities = request['entities']
					cleverStr = getClever(request)
					context = Hash.new
					context['cleverStr'] = cleverStr
					return context				  
				}
			}
			@client = Wit.new(access_token: access_token, actions: actions)

		end

		def client
			return @client
		end
		
		def responses
			return @responses
		end	

  private
  
  def self.nonsenseCheck request, response
    if request['entities']
    
      @initial = request['entities']['intent'][0]
    
      if @initial['confidence'] < 0.98 && @initial['suggested'] == true
        response['cleverbotInit'] = true
      end
    
    end  
  end

  def first_entity_value(entities, entity)
    return nil unless entities.has_key? entity
    val = entities[entity][0]['value']
    return nil if val.nil?
    return val.is_a?(Hash) ? val['value'] : val
  end


  def getProgSkills
    explainStr = "Byron has been working with"
    javascriptStr = "javascript for #{MyTime.new('2015-04-30').calculate[:diff]}."
    rubyStr = "He has been using ruby for #{MyTime.new('2015-09-21').calculate[:diff]}.  Ask again and the times will update ;)"
    progStr = "#{explainStr} #{javascriptStr} #{rubyStr}"
    return progStr
  end  
  

  
  def getDances
  
    pumpkinDances = [
      {
      "text" => "Watch him bust a move with ",
      "band" => "21 Pilots",
      "link" => "https://www.youtube.com/watch?v=aaHw8QfemHk"
      },{
        "text" => "Oh snap! He get's down with ",
        "band" => "Ke$ha",
        "link" => "https://www.youtube.com/watch?v=J_6aIPbQht4"
      },{
        "text" => "Aw yeah.  Loves to boogie to ",
        "band" => "Wii Music",
        "link" => "https://www.youtube.com/watch?v=7MGsaN5eDfc"
      }]  
    
    randomDance = pumpkinDances[rand(0..2)]
    text = randomDance["text"]
    band = randomDance["band"]
    link = randomDance["link"]
    danceStr = "#{text}<a target=\"_blank\" href=\"#{link}\">#{band}</a>"
    return danceStr
  end
  
  def getClever request
    omessage = request["context"]["omessage"]
    @clever = CleverbotHelper::CleverbotExtension.new
    @cleverbot = @clever.cleverbot
    @cleverreply = @cleverbot.say omessage
    return @cleverreply
  end

  
  def getJobSums entities
    selection = entities["jobSum"][0]["value"].to_i
  	@jobSummary = WitExtension.work_history[selection].summary
  	puts @jobSummary
  	return @jobSummary
  end
  
  def self.work_history
    
    sys_adm = Job.new('Stellar Manufacturing', 'Systems Administrator', '2011 - 2014', 'Here he administered and supported a Windows environment from servers to workstations, SQL to Exchange.')  
    data_analys = Job.new('JDA eHealth Systems', 'Data Analyst', '2014 - 2015', 'This position involved monitoring and troubleshooting multiple ETL processes of healthcare billing data. Most the related programming was Foxpro and SQL.')  
    sys_analys = Job.new('the Village of Oak Park', 'Systems Analyst', '2015 - 2016', 'He developed a web application with a javascript front-end (ExtJS) and Coldfusion/SQL backend.  He also supported various applications with SQL programming.')  
    
    @work_history = [sys_analys, data_analys, sys_adm]  
    return @work_history
  end
  
  def getJobs 
    


    jobStr = "Byron's last 3 jobs - starting at most recent - were as "
      WitExtension.work_history.each do |job|
        if WitExtension.work_history.last == job
          jobStr += "and "
        end
        jobStr += "a #{job.position} at #{job.company}"
        if WitExtension.work_history.last != job
          jobStr += ", "
        else
        	jobStr += "."
        end  
      end
      jobStr +=  " Let me know if you want more detail on any of these."
    return jobStr
    
  end

		
	end
class Job
  attr_accessor :company, :position, :span, :summary
  def initialize(company, position, span, summary)  
    @company = company  
    @position = position
    @span = span
    @summary = summary
  end

end	
class MyTime

  attr_accessor :starttime
  def initialize starttime
    @starttime = starttime
  end

  def calculate
      diff = Time.diff(Time.now, Time.parse(starttime), '%y, %M, %w, %d, %H, %N, and %S')
      return diff
  end
end
	
end