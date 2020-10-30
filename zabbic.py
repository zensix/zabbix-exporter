import pprint
class ZabbixClient():
    def __init__(self,user, pwd, url):
        self.url=url
        self.user=user
        self.pwd=pwd
        self.tocken=None
    def dump(self):
        ppprint.pprint(self)

def main():
    print ("hello world!")
    test = ZabbixClient(user="zabbixapi",pwd="zabbixapi",url="http://zabbix.stef.local")
    test.dump()

if __name__ == "__main__":
    main()