import argparse
import csv
import json
import timeit
#from vaderSentiment import sentiment as vaderSentiment
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment

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
		description="Analyze sentiment of text using VADER",
		formatter_class=argparse.ArgumentDefaultsHelpFormatter)
	parser.add_argument('filename', help="Data Input file w/ filetype ending")
	parser.add_argument('-w', '--write', type=str, help="Write to filename")

	args = parser.parse_args()

    #Clean args
	args.filename = unicode(args.filename)
	args.write = unicode(args.write)

	filetype = args.filename.split('.')

	srcText = None
	if(filetype[1] == 'json'):
		srcText = JSONFetcher(filetype[0])
	else:
		srcText = CSVFetcher(filetype[0])

	writer = None
	writeType = None
	if(args.write):
		if(args.write.split('.')[1] == 'json'):
			outfile = open(args.write, 'wb')
			writeType = 'json'
		else:
			print "ERROR: CSV writing not implemented"
			sys.exit("Don't choose CSV")
			#outFile = open(args.write, 'wb')
			#writer = csv.writer(outFile)
			#cols = ["tweetID", "feedID", "topic", "text"]
			#writer.writerow(cols)
			#writeType = 'csv'

	tweetsProcessed = 0
	for record in srcText.fetch():
		try:
			textSentiment = vaderSentiment(str(record['text']))
			record['sentiment'] = str(textSentiment)

			if(args.write):
				if(writeType == 'csv'):
					print "ERROR: CSV Writing not supported"
					sys.exit("Don't choose CSV")
					#writer.writerow([
					#		tweetID,
					#		feedID,
					#		tweetTopic,
					#		tweetText
					#	])
				elif(writeType == 'json'):
					jsonOut = json.dumps(record)
					outfile.write(jsonOut + '\n')
				else:
					print "ERROR: Unsupported write type"
			else:
				print("Text:" + record['text'])
				print("Sentiment: " + str(textSentiment))

		except Exception as err:
			print "ERROR: Couldn't analyze sentiment"
			print str(err)
		else: 
			tweetsProcessed+=1
			if(tweetsProcessed % 1000 == 0):
				print(str(tweetsProcessed) + " tweets processed")

	outfile.close()
	print("Operation finished")

	timeEnd = timeit.default_timer()
	print("Elapsed Time: " + repr(timeEnd - timeStart) + "s")

	#print("Feeds Classified: " + str(feedsProcessed))
	print("Sentiment analysis run on " + str(tweetsProcessed) + " tweets.")


