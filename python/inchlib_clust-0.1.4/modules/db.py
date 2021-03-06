#coding: utf-8

'''
Mysql database extension for inchlib_clust

	Škuta, C.; Bartůněk, P.; Svozil, D. InCHlib – 
	interactive cluster heatmap for web applications. 
	Journal of Cheminformatics 2014, 6 (44), DOI: 10.1186/s13321-014-0044-4.

Author: 	David Sundell 2017
Contact: 	davve_2@yahoo.se | david.sundell@umu.se

Umeå university 2017
'''

'''
Import nessesary libraries

'''

import MySQLdb as mysql
from MySQLdb.constants import FIELD_TYPE
'''
	Error classes
'''

class SettingsError(object):
	"""
		An error class that returns an error message defining which setting variable that was causing the error
		Use the example settings file as a guide to correct your settings.
	"""
	def __init__(self, value):
		self.value = value
	def __str__(self):
		return repr(self.value)

class Database(object):
	"""
		This Database module is implemented to read data for inchlib_clust directly from a mysql database
	"""
	
	def __init__(self, password_file,database,host="127.0.0.1"):
		####print "Initiating database object...."
		#super(Database, self).__init__()
		'''Set host default 127.0.0.1'''
		self.host = host

		'''Read settings file'''
		self._read_passfile(password_file)

		'''Connect to database'''
		####print database
		self.database = database
		self.db = self.__connect_to_database(database)
		self.verbose = False

	'''Read password file and connect to the database'''

	def _inchlib_set_pass(self,password):
		self.password = password

	def _inchlib_set_user(self,user):
		self.user = user

	def _inchlib_set_host(self,host):
		self.host = host

	def _inchlib_set_database(self,database):
		self.database = database

	def _read_passfile(self,password_file=False):
		'''
			The passwod file needs to be protected. The path to the password file should be passed as an argument to commandline inchlib_clust "database_pwfile"
		'''
		if not password_file:
			raise SettingsError("No password file path was provided.")
		
		with open(password_file, "r") as f:
			for row in f:
				if not row.startswith("#") and row.startswith("inchlib_"):
					function,var = row.strip("\n").split(": ")
					if not function == "inchlib_set_database":
						####print function,var
						getattr(self,"_"+function)(var)
					try:
						getattr(self,"_"+function)(var)
					except TypeError:
						raise SettingsError("%s is not a valid settings variable: see the CMS example settings file" % (function))

	def __connect_to_database(self,database=False):
		if not database:
			database = self.database
		####print "connecting to ", database
		'''Retrieve database information and password and return a database'''
		my_conv = { FIELD_TYPE.LONG: int }
		return mysql.connect(host=self.host,user=self.user,passwd=self.password,db=self.database,conv=my_conv)  #db connection

	def __query(self,input):
		'''Best way to make a query with mysql, includes buffer and error handeling, and returns a list with results'''
		c = self.db.cursor()
		try:
			buffer = input.strip()
			x = c.execute(buffer)
			res = c.fetchall()
			return res
		except mysql.Error, e:
			return "An error occurred with you mysql request:", e.args[0]

	def query(self,input):
		'''Best way to make a query with mysql, includes buffer and error handeling, and returns a list with results'''
		c = self.db.cursor()
		try:
			buffer = input.strip()
			x = c.execute(buffer)
			res = c.fetchall()
			return res
		except mysql.Error, e:
			return "An error occurred with you mysql request:", e.args[0]


	'''Functions for inchlib_clust.py'''

	def __parse_meta_res(self,result):
		'''Parse database output for metadata'''
		#res = [str(int(row[0])) for row in result]
		#res = [str(row[0]) for row in result]
		#return ",".join(res)
		self.geneDict = {}
		for row in result:
			self.geneDict[row[0]] = row[1]
			self.geneDict[row[1]] = row[0]


	def __parse_db_res(self,result,samples,sample_names):
		#print(sample_names.split(","))
    		'''Parse the database result and add missing values'''
		data = []
		datax=[]
		datatad=[]
		self._get_genes(self.features)
		#i2=0
		for i in range(len(result)):
			#### As data is coming sorted by genes, the length of sample input reflects the number of rows per sample
			### Handle missing values
			#if i != samples[i]:
			#	rest = sample
			#	for x in range(rest):
			#		data.append(None)
			feature,expression = result[i]  ## if implementation requires advanced 
			#if(i%len(samples)==0):
			#	print i,feature
			tt=sample_names.split(",")
			temp=i % (len(samples))
			
			if True:
				'''Translate the gene index to a gene ID for easier identification of rows'''
				feature = self.geneDict[feature]
			#expression = result[i]
			#print i % len(samples)
			#if i==0:
    		#		data[-1].insert(0,tt)

			qq=[]
			if i < len(samples) :
				qq=tt
				datax.extend(qq)
			if i > -1 and temp == 0:
				testme=[]
				testme.append(feature)
			testme.append(expression)    
			if(len(testme)==len(samples)+1 and len(testme)>1):
				data.append(testme) 
		datatad.append(datax)
		datatad.extend(data) 
		#print datatad
		#datax.pop() ## remove last empty array
		return datatad

	def verbose_mode(self):
		'''Turn on verbose printing'''
		self.verbose = False

	def _get_samples(self,samples,table):
		'''Return sample indexes from sample IDs'''
		table = table.split("_")[-1]
		query = '''
				SELECT sample_i FROM sample_%s WHERE
					sample_id in ("%s") order by sample_id
		'''
		samples = self.__parse_meta_res(self.__query(query % (table,samples)))
		return samples

	def _get_genes(self,genes):
		'''Return gene indexes from gene IDs'''
		genes = '","'.join(genes)
		query = '''
				SELECT gene_i,gene_id FROM gene_info WHERE
					gene_id in ("%s") order by gene_i
		'''
		_genes = self.__parse_meta_res(self.__query(query % (genes)))
		return _genes



	def __get_feature_index(self,features,type="gene"):
		'''Fetch feature indexes'''
		query= '''
			SELECT %s_i
				FROM %s_info
				WHERE %s_id in ("%s") 
		'''
		if self.verbose:
			print features
			print query % (type,type,type,'","'.join(features))
			print self.__query(query % (type,type,type,'","'.join(features)))
		feature_index = [x[0] for x in self.__query(query % (type,type,type,'","'.join(features)))]
		#print feature_index
		return feature_index

	def __get_sample_index(self,samples,table):
		'''Fetch sample indexes'''
		query = '''
			SELECT %s 
				from expression_%s 
				where id=(select id from expression_%s where log2> 1 limit 1)  order by sample_i
		'''
		if self.verbose:
			print query % (samples,table,'","'.join(samples.split(",")))
		#sample_index = map(str,[x[0] for x in self.__query(query % (table,'","'.join(samples.split(","))))])
		sample_index = map(str,[x[0] for x in self.__query(query % (samples,table,table))])
		return sample_index

	def get_matrix_data(self,features,samples,table,datatype,feature_id="gene"):
		'''Get the data matrix from the database, features (genes) samples and table required'''
		#print(samples);

		self.features = features
		feature_index = self.__get_feature_index(features,type=feature_id)
		sample_index = self.__get_sample_index("sample_i",table)
		if(samples == "true"):
    			samples = self.__get_sample_index("sample",table)			
		else:
    			samples = self.__get_sample_index("sample_name",table)	
		samples=','.join(samples)

		#print(features,samples,table,datatype,feature_id,feature_index,sample_index)
		if self.verbose:
			print feature_index
			print sample_index
		#puk='","'.join(samples.split(","))	
		#datatype="vst"
		cdata = (
					datatype, 	### Set which columns to retrieve from database
					table, 		### The table from which to retrieve data
					','.join(feature_index),		### Input features
					','.join(sample_index),	### Samples to fetch egt sample index first
		)	

		### Query for retrieving expression values
		if(datatype=="vst"):
    			query= '''
		 			SELECT gene_i,cast(log2 as decimal(7,4))
		 				FROM expression_'''+cdata[1]+'''
		 				WHERE gene_i in ('''+cdata[2]+''')
		 					AND sample_i in ('''+cdata[3]+''')  order by gene_i,sample_i   #group by sample_i,gene_i
		 			'''	
		else:
    			query= '''
					select s1.gene_i,cast((s1.log2-avg(s2.log2))/std(s2.log2) as decimal(7,4)) as log2
						from expression_'''+cdata[1]+''' as s1 inner join expression_'''+cdata[1]+''' as s2 on s1.id=s2.id 
						where s1.gene_i in ('''+cdata[2]+''') and s1.sample_i in ('''+cdata[3]+''') group by s1.gene_i,s1.sample_i '''
   			
		
		#print(datatype)
		### Results are given one value per row ordered by gene then sample missing samples will be missing		
		if self.verbose:
			print query % cdata
		#print  query
		#print (self.__query(query))
		#data = [list(x) for x in self.__query(query % cdata)]
		#print query
		data = self.__parse_db_res(self.__query(query),sample_index,samples)
		#print data 
		return data


	def get_meta_data(self,features,columns,table):
		'''Function extracts heatmap metadata from table'''
		return metadata,metadata_header

	def get_column_metadata(self):
		'''Function extracts heatmap column data from table'''
		return column_metadata,header

	def get_alternative_column_metadata(self):
		'''Function extracts heatmap response column data from table'''
		return alternative_data


if __name__=="__main__":
	ndb = Database("pass.txt","popgenieDB_V3")
	#ndb.verbose_mode()
	res = ndb.get_matrix_data(
			"Potri.001G000200,Potri.009G012300", 
			"K1-01,K1-02", 
			"wood", 
			datatype = "vst",
			feature_id = "gene",
			scaling="vst"
	)
	#print res







	
