const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

dotenv.config();

(async () => {
  try {
    console.log("브라우저를 실행합니다...");
    const browser = await puppeteer.launch({ headless: false });
    console.log("브라우저 실행 완료.");

    const page = await browser.newPage();
    console.log("새 페이지 생성 완료.");

    console.log("페이지 로드 중...");
    await page.goto("https://www.reddit.com/");
    console.log("페이지 로드 완료.");

    await page.setViewport({ width: 1080, height: 1024 });
    console.log("뷰포트 설정 완료.");

    console.log("5초 대기 중...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5초 대기
    console.log("5초 대기 완료.");

    console.log("Log In 버튼 클릭 시도 중...");
    // await page.locator('div ::-p-text(Log In)').click();

    const loginButton = await page.waitForSelector(
      "::-p-xpath(//*[@id='login-button']//*[text()='Log In'])"
    );

    if (loginButton) {
      await loginButton.click(); // 버튼 클릭
      console.log("Log In 버튼 클릭 완료.");
    } else {
      console.log("Log In 버튼을 찾을 수 없습니다.");
      await browser.close();
      return;
    }

    console.log("Shadow DOM 접근 시도 중...");
    // Shadow Host for Username
    console.log("username Shadow Host 찾기...");
    const shadowHostUsername = await page.waitForSelector(
      "faceplate-text-input#login-username"
    );
    const shadowRootUsername = await page.evaluateHandle(
      (host) => host.shadowRoot,
      shadowHostUsername
    );

    console.log("Shadow DOM 내부에서 username 필드 찾기...");
    const usernameInput = await shadowRootUsername.$("input");
    if (usernameInput) {
      console.log("username 입력 중...");
      await usernameInput.type(process.env.USERNAME, { delay: 100 }); // 환경 변수 사용
      console.log("username 입력 완료.");
    } else {
      console.error("username 입력 필드를 찾을 수 없습니다.");
    }

    // Shadow Host for Password
    console.log("password Shadow Host 찾기...");
    const shadowHostPassword = await page.waitForSelector(
      "faceplate-text-input#login-password"
    );
    const shadowRootPassword = await page.evaluateHandle(
      (host) => host.shadowRoot,
      shadowHostPassword
    );

    console.log("Shadow DOM 내부에서 password 필드 찾기...");
    const passwordInput = await shadowRootPassword.$("input");
    if (passwordInput) {
      console.log("password 입력 중...");
      await passwordInput.type(process.env.PASSWORD, { delay: 100 }); // 환경 변수 사용
      console.log("password 입력 완료.");
    } else {
      console.error("password 입력 필드를 찾을 수 없습니다.");
    }

    
    // Shadow Host에서 Shadow Root 가져오기
    const shadowHostLoginButton = await page.waitForSelector(
      "faceplate-tracker"
    );
    const shadowRootLoginButton = await page.evaluateHandle(
      (host) => host.shadowRoot,
      shadowHostLoginButton
    );

    // Shadow DOM 내부의 Log In 버튼 찾기
    console.log("두 번째 Log In 버튼 클릭 시도 중...");
    const nextLoginButton = await page.evaluateHandle(
      (root) => root.querySelector("login"),
      shadowRootLoginButton
    );

    // Log In 버튼 클릭
    if (nextLoginButton) {
      try {
        await nextLoginButton.click();
        console.log("두 번째 Log In 버튼 클릭 완료");
      } catch (error) {
        console.error("두 번째 Log In 버튼 클릭 실패:", error);
      }
    } else {
      console.error("두 번째 Log In 버튼을 찾을 수 없습니다.");
    }

    // 브라우저 종료
    // console.log("5초 대기 후 브라우저 종료...");
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await browser.close();
    console.log("브라우저 종료 완료.");
  } catch (error) {
    console.error("오류 발생:", error);
  }
})();
