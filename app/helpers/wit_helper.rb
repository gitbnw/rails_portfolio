module WitHelper

	class WitExtension
		def initialize
			access_token = "H54ADICW2CDDBJZI2C3PX7BGG5Z7HVS3"
			@responses = []
			actions = {
				send: -> (request, response) {
					puts("bot is sending... #{response['text']}") 
					@responses << response
				},
				getJobs: -> (request) {
					context = request['context']
					entities = request['entities']
					jobHistory = getJobs(work_history)
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
					jobSummary = getJobSums(request['entities'], work_history)
					context['jobSummary'] = jobSummary
					return context
				},
				cleanUp: -> (request) {
					context = Hash.new
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
      "text" => "Bust a move with ",
      "band" => "21 Pilots",
      "link" => "https://www.youtube.com/watch?v=aaHw8QfemHk"
      },{
        "text" => "Oh snap! Get down with ",
        "band" => "Ke$ha",
        "link" => "https://www.youtube.com/watch?v=J_6aIPbQht4"
      },{
        "text" => "Aw yeah.  Love to boogie to ",
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
  

  
  def getJobSums entities, work_history
    selection = entities["jobSum"][0]["value"].to_i
  	@jobSummary = work_history[selection].summary
  	puts @jobSummary
  	return @jobSummary
  end
  
  def getJobs work_history

    jobStr = "Byron's last 3 jobs - starting at most recent - were as "
      work_history.each do |job|
        if work_history.last == job
          jobStr += "and "
        end
        jobStr += "a #{job.position} at #{job.company}"
        if work_history.last != job
          jobStr += ", "
        else
        	jobStr += "."
        end  
      end
      jobStr +=  " Let me know if you want more detail on any of these."
    return jobStr
    
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