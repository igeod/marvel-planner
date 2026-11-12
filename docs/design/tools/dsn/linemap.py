import difflib
def lmap(old,new):
    a=open(old).read().split('\n');b=open(new).read().split('\n')
    m={};sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
    for t,i1,i2,j1,j2 in sm.get_opcodes():
        if t=='equal':
            for k in range(i2-i1): m[i1+k+1]=j1+k+1
    return m
if __name__=='__main__':
    import sys
    m=lmap('/tmp/src_old/styles/tokens.less','/mnt/user-data/uploads/marvel-planner/src/styles/tokens.less')
    for n in [23,24,45,46,47,66,82,87,88,89,123,176,177,183,184,193,204,205,206,216,218,224,227,230,234]:
        print(n,m.get(n))
