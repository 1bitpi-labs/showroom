"""Capture evidence; pixel similarity is not a quality tier or accessibility audit."""
import argparse
import asyncio
import json
from pathlib import Path

async def capture(args):
    from playwright.async_api import async_playwright
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    report = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=args.browser_executable)
        try:
            for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
                page = await browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                response = await page.goto(args.url, wait_until='networkidle', timeout=30000)
                await page.evaluate('document.fonts.ready')
                await page.screenshot(path=str(out / f'{name}.png'), full_page=True, animations='disabled')
                overflow = await page.evaluate('document.documentElement.scrollWidth > innerWidth')
                entry = {'http_status': response.status if response else None, 'horizontal_overflow': overflow, 'errors': errors}
                if args.reference:
                    from PIL import Image, ImageChops, ImageStat
                    with Image.open(out / f'{name}.png') as actual, Image.open(Path(args.reference) / f'{name}.png') as reference:
                        if actual.size != reference.size:
                            entry['comparison'] = 'incomparable dimensions'
                        else:
                            diff = ImageChops.difference(actual.convert('RGB'), reference.convert('RGB'))
                            entry['pixel_similarity'] = 1 - sum(ImageStat.Stat(diff).mean) / (3 * 255)
                report[name] = entry
                await page.close()
        finally:
            await browser.close()
    (out / 'audit.json').write_text(json.dumps(report, indent=2) + '\n')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser-executable', help='Optional existing Chromium executable')
    parser.add_argument('--url', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--reference', help='Directory containing desktop.png and mobile.png')
    asyncio.run(capture(parser.parse_args()))
