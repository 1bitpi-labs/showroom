"""Bounded public-source discovery and measured desktop/mobile evidence.
No authentication, source code redistribution, or automatic high-tier grading.
"""
import asyncio
import json
from pathlib import Path
from datetime import datetime, timezone
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
SITES = ['dithercn.dev','fffuel.co','fontshare.com','poly.pizza','ambientcg.com','landdding.com','recent.design','pixlpin.com','designdetails.io','navbar.gallery','component.gallery','prettysites.io','mahero.supply','mobbin.com','pageflows.com','refero.design','spottedinprod.com','fontinlogo.com','60fps.design']
INSPECT = r'''() => {
 const visible=e=>{let r=e.getBoundingClientRect();return r.width>0&&r.height>0};
 const spec=e=>{let s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,role:e.getAttribute('role'),text:(e.innerText||'').slice(0,140),bounds:{x:r.x,y:r.y,width:r.width,height:r.height},styles:Object.fromEntries(['display','position','fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','gap','padding','borderRadius','gridTemplateColumns'].map(k=>[k,s[k]]))}};
 return {url:location.href,title:document.title,text:document.body.innerText.slice(0,4000),viewport:{width:innerWidth,height:innerHeight},horizontal_overflow:document.documentElement.scrollWidth>innerWidth,headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).slice(0,12).map(spec),components:[...document.querySelectorAll('header,nav,main,section,form,button,[role="tablist"]')].filter(visible).slice(0,24).map(spec),links:[...document.querySelectorAll('a[href]')].map(a=>({text:(a.innerText||'').slice(0,70),href:a.href})).filter(a=>/^https?:/.test(a.href)).slice(0,180),broken_images:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getBoundingClientRect().width>0).map(i=>i.currentSrc).slice(0,20),tokens:Object.fromEntries([...getComputedStyle(document.documentElement)].filter(k=>k.startsWith('--')).slice(0,80).map(k=>[k,getComputedStyle(document.documentElement).getPropertyValue(k)]))};
}'''

async def audit(browser, site, url=None, suffix='home'):
    ident = site.replace('.','-')+'-'+suffix
    out = ROOT/'audits/source-evidence'/ident
    out.mkdir(parents=True,exist_ok=True)
    result={'site':site,'url':url or 'https://'+site,'captured_at':datetime.now(timezone.utc).isoformat(),'views':{},'scope':'public source reference; not a locally reconstructed component'}
    context=await browser.new_context(reduced_motion='reduce')
    page=await context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)[:300]))
    try:
        response=await page.goto(result['url'],wait_until='domcontentloaded',timeout=25000)
        result['http_status']=response.status if response else None
        for name,w,h in [('desktop',1440,900),('mobile',390,844)]:
            await page.set_viewport_size({'width':w,'height':h})
            await page.wait_for_timeout(1800)
            try: await page.evaluate('() => Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))])')
            except Exception: pass
            data=await page.evaluate(INSPECT)
            assert data['viewport']=={'width':w,'height':h}, data['viewport']
            await page.screenshot(path=str(out/f'{name}.png'),animations='disabled')
            result['views'][name]=data
        result['page_errors']=errors[:20]
    except Exception as e:
        result['error']=str(e)[:700]
    finally: await context.close()
    (out/'evidence.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'site':site,'page':suffix,'status':result.get('http_status'),'error':result.get('error'),'title':result['views'].get('desktop',{}).get('title')},ensure_ascii=False),flush=True)
    return result

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path='/home/caueantonacci/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',args=['--no-sandbox'])
        results=[]
        for start in range(0,len(SITES),3):
            results.extend(await asyncio.gather(*(audit(browser,s) for s in SITES[start:start+3])))
        (ROOT/'audits/discovery.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
        await browser.close()

if __name__=='__main__': asyncio.run(main())
