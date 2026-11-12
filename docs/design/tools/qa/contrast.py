def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
L=dict(bg='#E9ECF1',surface='#F7F8FA',ink='#14171F',ink2='#4D5465',acc='#C8202B',accT='#B01B25',onacc='#FFFFFF',rowhover='#DCE0E8',panel='#14171F',ondark='#F2F4F8',muted='#A9B0C2',hl='#F2B01E')
D=dict(bg='#0B0D12',surface='#1B202C',ink='#F2F4F8',ink2='#B4BBCC',accT='#F05A63',hl='#F2B01E',onprim='#0B0D12',rowhover='#3A4260',panel='#3A4260',ondark='#F2F4F8',muted='#A9B0C2')
rows=[
('L h1/body ink on surface',L['ink'],L['surface'],4.5),
('L body ink-2 on surface',L['ink2'],L['surface'],4.5),
('L primary: white on accent',L['onacc'],L['acc'],4.5),
('L soft: ink on row-hover',L['ink'],L['rowhover'],4.5),
('L btn--text accent-text on surface',L['accT'],L['surface'],4.5),
('L focus ring accent vs surface',L['acc'],L['surface'],3),
('L focus ring accent vs soft button',L['acc'],L['rowhover'],3),
('L card (surface) vs page (bg) - non text',L['surface'],L['bg'],1.0),
('D h1/body ink on surface',D['ink'],D['surface'],4.5),
('D body ink-2 on surface',D['ink2'],D['surface'],4.5),
('D primary: deepest on highlight',D['onprim'],D['hl'],4.5),
('D soft: ink on row-hover',D['ink'],D['rowhover'],4.5),
('D btn--text accent-text on surface',D['accT'],D['surface'],4.5),
('D focus ring highlight vs surface',D['hl'],D['surface'],3),
('D focus ring highlight vs soft',D['hl'],D['rowhover'],3),
('D primary button gold vs surface (UI)',D['hl'],D['surface'],3),
('L soft button vs surface (UI)',L['rowhover'],L['surface'],1.0),
('D soft button vs surface (UI)',D['rowhover'],D['surface'],1.0),
]
for n,a,b,m in rows: print(f"{cr(a,b):5.2f}  (min {m})  {n}")
