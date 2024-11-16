const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('브라우저를 실행합니다...');
        const browser = await puppeteer.launch({ headless: false });
        console.log('브라우저 실행 완료.');

        const page = await browser.newPage();
        console.log('새 페이지 생성 완료.');

        console.log('페이지 로드 중...');
        await page.goto('https://www.reddit.com/');
        console.log('페이지 로드 완료.');

        await page.setViewport({ width: 1080, height: 1024 });
        console.log('뷰포트 설정 완료.');

        await page.waitForTimeout(5000);
        console.log('5초 대기 완료.');

        await browser.close();
        console.log('브라우저 종료.');
    } catch (error) {
        console.error('오류 발생:', error);
    }
})();
