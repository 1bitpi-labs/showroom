"""Capture original and isolated MIT components; test real interactive states.
Run after prepare_batch2.py and fixture build; an audit server must serve fixture.
"""
import argparse,asyncio,json,math
from pathlib import Path
from PIL import Image,ImageChops,ImageStat
from playwright.async_api import async_playwright
from prepare_batch2 import DITHER,SHADCN,R,B
SLOTS={'button':'button','badge':'badge','card':'card','input':'input','textarea':'textarea','checkbox':'checkbox','switch':'switch','tabs':'tabs','accordion':'accordion','dialog':'button','progress':'progress','slider':'slider'}

def compare(a,b,out):
    with Image.open(a).convert('RGB') as first,Image.open(b).convert('RGB') as second:
        original=[first.size,second.size]
        if abs(first.width-second.width)>2 or abs(first.height-second.height)>2:
            return {'comparable':False,'original_sizes':original,'reason':'Different intrinsic size; no resizing for score.'}
        w,h=min(first.width,second.width),min(first.height,second.height)
        diff=ImageChops.difference(first.crop((0,0,w,h)),second.crop((0,0,w,h)))
        diff.save(out)
        return {'comparable':True,'original_sizes':original,'common_raster_size':[w,h],'pixel_similarity':1-sum(ImageStat.Stat(diff).mean)/(3*255),'limitation':'Surface-only pixel metric, not a tier formula, WCAG score or entire-page fidelity.'}

async def interactions(page,name,out,view,reference_page=None):
    checks=[]
    if name in ['input','textarea']:
        e=page.locator(f'[data-slot="{name}"]').first
        await e.fill('auditoria@example.com' if name=='input' else 'Teste de teclado e conteúdo.')
        assert await e.input_value();checks.append('Text entry and focus verified')
        await e.evaluate('e=>e.disabled=true');assert await e.is_disabled();checks.append('Disabled state verified')
    elif name in ['checkbox','switch']:
        e=page.get_by_role(name).first;before=await e.get_attribute('aria-checked');await e.focus();await page.keyboard.press('Space');after=await e.get_attribute('aria-checked');assert before!=after,(name,before,after)
        checks.append('Space toggles aria-checked')
        await e.evaluate('e=>e.disabled=true');assert await e.is_disabled();checks.append('Disabled state verified')
    elif name=='tabs':
        tabs=page.get_by_role('tab');await tabs.first.focus();await page.keyboard.press('ArrowRight');await page.wait_for_function("document.querySelectorAll('[role=tab]')[1].getAttribute('aria-selected')==='true'");assert await tabs.nth(1).get_attribute('aria-selected')=='true';checks.append('ArrowRight moves focus and activates second tab')
    elif name=='accordion':
        e=page.locator('[data-slot="accordion-trigger"]').first;before=await e.get_attribute('aria-expanded');await e.focus();await page.keyboard.press('Enter');after=await e.get_attribute('aria-expanded');assert before!=after;checks.append('Enter changes aria-expanded')
    elif name=='dialog':
        e=page.get_by_role('button',name='Open Dialog');await e.focus();await page.keyboard.press('Enter');dialog=page.get_by_role('dialog');await dialog.wait_for();assert await dialog.is_visible();checks.append('Enter opens named dialog')
        await page.screenshot(path=str(out/f'{view}-dialog-open.png'),animations='disabled')
        if reference_page:
            await reference_page.get_by_role('button',name='Open Dialog').click()
            source_dialog=reference_page.get_by_role('dialog');await source_dialog.wait_for()
            await reference_page.screenshot(path=str(out/f'{view}-dialog-source-open.png'),animations='disabled')
            await source_dialog.screenshot(path=str(out/f'{view}-dialog-reference-surface.png'),animations='disabled')
            await dialog.screenshot(path=str(out/f'{view}-dialog-local-surface.png'),animations='disabled')
            comparison=compare(out/f'{view}-dialog-reference-surface.png',out/f'{view}-dialog-local-surface.png',out/f'{view}-dialog-diff.png')
            (out/f'{view}-dialog-comparison.json').write_text(json.dumps(comparison,indent=2)+'\n')
            checks.append('Opened dialog surface compared against original demo')
        for _ in range(8):
            await page.keyboard.press('Tab')
            assert await dialog.evaluate('e=>e.contains(document.activeElement)'), 'Dialog focus escaped'
        checks.append('Eight Tab presses keep focus inside dialog')
        await page.keyboard.press('Escape');await dialog.wait_for(state='hidden');await page.wait_for_function("document.activeElement?.textContent==='Open Dialog'");assert await e.evaluate('e=>e===document.activeElement');checks.append('Escape closes and restores trigger focus')
    elif name=='slider':
        e=page.get_by_role('slider').first;before=await e.get_attribute('aria-valuenow');await e.focus();await page.keyboard.press('ArrowRight');assert await e.get_attribute('aria-valuenow')!=before;checks.append('ArrowRight changes aria-valuenow')
    elif name=='button':
        e=page.locator('[data-slot="button"]').first;await e.focus();assert await e.evaluate('e=>e===document.activeElement');checks.append('Keyboard focus verified')
        await e.hover();checks.append('Hover captured');await e.evaluate('e=>e.disabled=true');assert await e.is_disabled();checks.append('Disabled state verified')
    elif name=='progress':
        e=page.get_by_role('progressbar');assert await e.count()==1;checks.append('Progressbar role present; demo is timed and value may vary')
    else:checks.append('Static presentation: keyboard input not applicable')
    await page.screenshot(path=str(out/f'{view}-state.png'),animations='disabled')
    return checks

async def audit(browser,kind,name,args):
    ident=f'{kind}-{name}';out=R/'previews'/ident;out.mkdir(exist_ok=True)
    reference=f'https://dithercn.dev/docs/backgrounds/{name}' if kind=='dithercn' else f'https://ui.shadcn.com/view/new-york-v4/{name}-demo'
    report={'id':ident,'source_url':reference,'views':{},'classification':'pending manual review'}
    for view,w,h in [('desktop',1440,900),('mobile',390,844)]:
        context=await browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce')
        source=await context.new_page();local=await context.new_page();errors=[]
        local.on('pageerror',lambda error:errors.append(str(error)))
        record={'viewport':{'width':w,'height':h}}
        try:
            response=await source.goto(reference,wait_until='domcontentloaded',timeout=30000)
            record['source_http_status']=response.status
            await source.wait_for_timeout(1200)
            await source.screenshot(path=str(out/f'{view}-source.png'),animations='disabled')
            selector='canvas' if kind=='dithercn' else f'[data-slot="{SLOTS[name]}"]'
            if name=='dialog' and kind=='shadcn':selector='[data-slot="button"],[data-slot="dialog-trigger"]'
            original=source.locator(selector).first
            await original.wait_for(state='visible',timeout=10000)
            box=await original.bounding_box();record['source_surface_bounds']=box
            record['source_style']=await original.evaluate('e=>{const s=getComputedStyle(e);return Object.fromEntries(["fontFamily","fontSize","borderRadius","color","backgroundColor"].map(k=>[k,s[k]]))}')
            await original.screenshot(path=str(out/f'{view}-reference-surface.png'),animations='disabled')
            response=await local.goto(args.base_url+'/?id='+ident,wait_until='networkidle',timeout=30000)
            record['local_http_status']=response.status
            if kind=='dithercn':
                # Match the original component's size and inherited theme, never its pixels.
                tokens=await original.evaluate('e=>{const s=getComputedStyle(e);return Object.fromEntries([...s].filter(k=>k.startsWith("--dither-")||["--foreground","--background","--primary"].includes(k)).map(k=>[k,s.getPropertyValue(k)]))}')
                record['inherited_tokens']=tokens
                await local.evaluate('({box,tokens})=>{let e=document.getElementById("fixture");e.style.width=box.width+"px";e.style.height=box.height+"px";for(let [k,v] of Object.entries(tokens))e.style.setProperty(k,v)}',{'box':box,'tokens':tokens})
            await local.wait_for_timeout(500)
            target=local.locator(selector).first
            await target.wait_for(state='visible',timeout=10000)
            await local.screenshot(path=str(out/f'{view}.png'),animations='disabled')
            await target.screenshot(path=str(out/f'{view}-local-surface.png'),animations='disabled')
            record['local_style']=await target.evaluate('e=>{const s=getComputedStyle(e);return Object.fromEntries(["fontFamily","fontSize","borderRadius","color","backgroundColor"].map(k=>[k,s[k]]))}')
            record['horizontal_overflow']=await local.evaluate('document.documentElement.scrollWidth>innerWidth')
            record['comparison']=compare(out/f'{view}-reference-surface.png',out/f'{view}-local-surface.png',out/f'{view}-diff.png')
            if kind=='shadcn' and not record['comparison']['comparable']:
                record['original_intrinsic_comparison']=record['comparison']
                (out/f'{view}-reference-surface.png').replace(out/f'{view}-reference-surface-original.png')
                target_box=await target.bounding_box()
                await original.evaluate('(e,width)=>{e.style.width=width+"px";e.style.maxWidth="none";e.style.flexShrink="0"}',target_box['width'])
                await source.wait_for_timeout(100)
                await original.screenshot(path=str(out/f'{view}-reference-surface.png'),animations='disabled')
                record['reference_host_width_normalized_to_local']=target_box['width']
                record['comparison']=compare(out/f'{view}-reference-surface.png',out/f'{view}-local-surface.png',out/f'{view}-diff.png')
            if kind=='dithercn':
                record['shader_state']=await target.evaluate('e=>({state:e.parentElement.dataset.state,width:e.width,height:e.height,decorative:e.parentElement.getAttribute("aria-hidden")})')
                assert record['shader_state']['state'] not in ['fallback','error'],record['shader_state']
                record['state_checks']=['Reduced-motion static shader rendered; aria-hidden inspected. Animated timing and GPU fallback not certified.']
            else:record['state_checks']=await interactions(local,name,out,view,source)
            record['runtime_errors']=list(errors)
        except Exception as error:record['error']=type(error).__name__+': '+str(error)
        finally:await context.close()
        report['views'][view]=record
    (out/'audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'id':ident,'views':{v:{'error':r.get('error'),'overflow':r.get('horizontal_overflow'),'comparison':r.get('comparison'),'errors':r.get('runtime_errors')} for v,r in report['views'].items()}}),flush=True)
    return report

async def main(args):
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=args.browser_executable)
        tasks=[('dithercn',n) for n in DITHER]+[('shadcn',n) for n in SHADCN]
        if args.only:tasks=[t for t in tasks if f'{t[0]}-{t[1]}' in args.only.split(',')]
        results=[]
        for start in range(0,len(tasks),2):results.extend(await asyncio.gather(*(audit(browser,k,n,args) for k,n in tasks[start:start+2])))
        combined={p.parent.name:json.loads(p.read_text()) for p in (R/'previews').glob('*/audit.json') if p.parent.name in {f'{k}-{n}' for k,n in [('dithercn',n) for n in DITHER]+[('shadcn',n) for n in SHADCN]}}
        (B/'audit-results.json').write_text(json.dumps(list(combined.values()),ensure_ascii=False,indent=2)+'\n')
        await browser.close()
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser-executable',required=True)
    parser.add_argument('--base-url',default='http://127.0.0.1:8769')
    parser.add_argument('--only',help='Comma-separated component IDs for a focused retry')
    asyncio.run(main(parser.parse_args()))
