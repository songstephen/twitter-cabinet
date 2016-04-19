import argparse
import csv
import json
from textblob.classifiers import NaiveBayesClassifier
import timeit


#This tool classifies feed data using Naive Bayes classifier
# and given set of topics/examples of those topics

#Topic Training

topicSet = [
	('Should Congress raise the debt ceiling', 'Debt Ceiling'),
	('Should the U.S. withdraw troops from Afghanistan?', 'Afghanistan'),
	('Should the U.S. intervene in the affairs of other countries?', 'Foreign Intervention'),
	('Should the U.S. have bailed out the major banks during the financial crisis of 2008?',
		'Financial Regulation'),
	('Do you approve or disapprove with how Obama is handling the economy?',
		'Obama Economic Policy'),
	('Should we expand or dismatle our Medicare program?', 'Medicare'),
	('Should the federal government regulate the internet to deter online piracy?',
		'Internet'),
	('Do you believe the theory of Evolution?', 'Evolution'),
	('Should federal government limit funds to public schools that do not \
		meet peformance standards?', 'Education Funding'),
	('Should the federal government fund stem cell research?', 'Stem Cell Research'),
	('Should employers be required to pay men and women the same salary for the same job?',
		'Equal Pay'),
	('Should there be more restrictions on the current process of purchasing a gun?',
		'Gun Control'),
	('Should physically and mentally capable adults on welfare be required to work?',
		'Welfare'),
	('What is your stance on abortion?', 'Abortion'),
	('Do you support the Patient Protection and Affordable Care Act Obamacare?', 
		'Obamacare'),
	('Do you support the legalization of same sex marriage?', 'Gay Marriage'),
	('Should the government continue to fund Planned Parenthood?', 'Planned Parenthood'),
	('Should the U.S. conduct targeted airstrikes on Iran nuclear weapon facilities?',
		'Iran Airstrikes'),
	('Should illegal immigrants have access to government-subsidized healthcare?',
		'Immigration Healthcare'),
	('Should people on the "no-fly list" be banned from purchasing guns and ammunition?',
		'No-Fly List Gun Control'),
	('Should Muslim immigrants be banned from entering the country until the government \
		improves its ability to screen', 'Muslim Immigrants'),
	('Should the government increase environmental regulations to prevent global warming?',
		'Global Warming'),
	('Should the U.S. accept refugees from Syria?', 'Syrian Refugees'),
	('Should a photo ID be required to vote?', 'Voter Fraud'),
	('Should a business be able to deny service to a customer if the request conflicts \
		with the owners religious beliefs?', 'Religious Freedom Act'),
	('Should the government raise the federal minimum wage?', 'Minimum Wage'),
	('Should foreign terrorism suspects be given constitutional rights?', 'Terrorism'),
	('Should there be term limits set for members of Congress?', 'Term Limits'),
	('Should the government decrease military spending?', 'Military Spending'),
	('Should Apple unlock the iPhones of suspected terrorists for the FBI?', 'iPhone Encryption'),
	('Should national parks be preserved and protected by the federal government?', 'National Parks'),
	('Should illegal immigrants be offered in-state tuition rates at public colleges within their \
		residing state?', 'In-State Tuition'),
	('Should local police increase surveillance and patrol of Muslim neighborhoods?', 'Muslim Surveillance'),
	('Should victims of gun violence be allowed to sui firearms dealers and manufacturers?',
		'Gun Liability'),
	('Do you support increasing taxes for the rich in order to reduce interest rates for \
		student loans?', 'Student Loans'),
	('Should the U.S. increase restrictions on its current border security policy?', 'Border Security'),
	('Should the federal government require children to be vaccinated fro preventable \
		diseases?', 'Mandatory Vaccinations'),
	('Should the military be allowed to use enhanced interrogation techniques such as waterboarding',
		'Torture'),
	('Should immigrants be required to learn English?', 'Immigrant Assimilation'),
	('Should businesses be required to provide paid leave for full-time employees during the birth of a child',
		'Paid Sick Leave'),
	('Should corporations and unions Super PACs be allowed to donate to political candidates?',
		'Campaign Finance')

]

class CSVFetcher():
	def __init__(self, fileName):
		self.fileName = fileName + '.csv'

	def fetch(self):
		print("fetching...")

		with open(self.fileName, 'rb') as f:
			reader = csv.reader(f)
			for line in reader:
				yield line

class JSONFetcher():
	def __init__(self, fileName):
		self.fileName = fileName + '.json'

	def fetch(self):
		print("fetching...")

		with open(self.fileName, 'rb') as f:
			for line in f:
				yield json.loads(line)

if __name__ == "__main__":

	timeStart = timeit.default_timer()
	print("Operation started at: " + repr(timeStart))

	parser = argparse.ArgumentParser(
		description="Classify stories based on our NaiveBayesClassifier",
		formatter_class=argparse.ArgumentDefaultsHelpFormatter)
	parser.add_argument('filename', help="Data Input file w/ filetype ending")
	parser.add_argument('-w', '--write', type=str, help="Write to filename")
	
	args = parser.parse_args()

    #Clean args
	args.filename = unicode(args.filename)
	args.write = unicode(args.write)

	filetype = args.filename.split('.')

	feeds = None
	if(filetype[1] == 'json'):
		feeds = JSONFetcher(filetype[0])
	else:
		feeds = CSVFetcher(filetype[0])

	#HAMY: Add JSON Writer
	writer = None
	writeType = None
	if(args.write):
		if(args.write.split('.')[1] == 'json'):
			outfile = open(args.write, 'wb')
			writeType = 'json'
		else:
			outFile = open(args.write, 'wb')
			writer = csv.writer(outFile)
			cols = ["tweetID", "feedID", "topic", "text"]
			writer.writerow(cols)
			writeType = 'csv'

	#Begin feed processing
	feedsProcessed = 0
	tweetsProcessed = 0
	topicsProcessed = {}

	topicClassifier = NaiveBayesClassifier(topicSet)

	for feed in feeds.fetch():
		feedID = feed['twitterID']
		feedsProcessed += 1
		for tweet in feed['feed']:

			try:
				tweetID = tweet['id_str']
				tweetText = tweet['text']

				tweetTopic = topicClassifier.classify(tweetText.decode('utf-8'))

				if tweetTopic in topicsProcessed:
					topicsProcessed[tweetTopic] += 1
				else:
					topicsProcessed[tweetTopic] = 1

				if(args.write):
					if(writeType == 'csv'):
						writer.writerow([
								tweetID,
								feedID,
								tweetTopic,
								tweetText
							])
					elif(writeType == 'json'):
						toWrite = {"tweetID": tweetID, "feedID": feedID,
									"topic": tweetTopic, "text": tweetText}
						jsonOut = json.dumps(toWrite, separators=(',',':'))
						outfile.write(jsonOut + '\n')
					else:
						print "ERROR: Unsupported write type"
				else:
					print("TweetID:" + tweetID)
					print("FeedID: " + feedID)
					print("Topic: " + tweetTopic)

			except Exception as err:
				if('ascii' not in err):
					print("ERROR: Couldn't classify tweet")
					print(str(err))
			else:
				tweetsProcessed+=1
				if(tweetsProcessed % 1000 == 0):
					print(str(tweetsProcessed) + " tweets processed")


	#Clean up after everything
	print("Operation finished")

	timeEnd = timeit.default_timer()
	print("Elapsed Time: " + repr(timeEnd - timeStart) + "s")

	print("Feeds Classified: " + str(feedsProcessed))
	print("Tweets Classified: " + str(tweetsProcessed))

	print("Topic breakdown")
	for topic in topicsProcessed:
		print("--" + topic + ": " + str(topicsProcessed[topic]))






