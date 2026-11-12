import re,sys
s=open(f'@WORK@/inv/project/{sys.argv[1]}').read()
i=s.find('<x-dc>'); b=s[i:]
b=re.sub(r'<svg.*?</svg>','',b,flags=re.S); b=re.sub(r'<style.*?</style>','',b,flags=re.S)
j=b.find('data-dc-script'); script=b[j:]; b=b[:j]
t=re.sub(r'<[^>]+>','\n',b); t=re.sub(r'\n\s*\n+','\n',t)
print(t[:int(sys.argv[2]) if len(sys.argv)>2 else 6000])
if len(sys.argv)>3: print('---SCRIPT---'); print(re.sub(r'\s+',' ',script)[:int(sys.argv[3])])
