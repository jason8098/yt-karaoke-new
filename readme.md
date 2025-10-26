# 유튜브 노래방 개선판

## 소개
예전에 개발했던 [유튜브 노래방](https://github.com/jason8098/yt_karaoke) 의 단점을 보완한 버젼입니다.
이번에는 베이스 언어로 node.js 와 express.js 를 사용했습니다.

## 업데이트된 점
- yt-dlp 명령 인수에 파일크기 제한을 추가함으로써 좀 더 빠른 로딩이 가능합니다.
- 거미줄 처럼 꼬여있던 웹소켓 라우팅을 최적화 시켰습니다.
- control 페이지에만 있던 취소 기능을 다시 메인 리스트로 롤백 하였습니다. (control 페이지는 제거됨)
- 도메인 대응형 QR 코드 생성
- 검색 알고리즘 개선 (TJ, 금영, 해외 체널 분리 + 검색언어 자동인식 + 엉뚱하게 검색되던 문제 해결)

## 개선/추가된 점들
- 정보전송은 websocket (socket.io) 를 사용했습니다. 기존에는 일반 POST 방식을 썼었는데 서버와 클라이언트 동기화가 별로 효율적이지 못했고, 간혹 불안정 해져서 바꾸게 되었습니다.
- 기존에는 일부 영상들이 저작권 관련 문제 때문에 제대로 재생되지 않는 문제가 있어 yt-dlp 라이브러리를 활용해 영상 스트림 url 자체를 받아오는 방식으로 설계 되었습니다.
- 또한 개인 설정창을 만들어 사용자가 선호하는 언어, 지역 등을 설정 할 수 있습니다.
- 이전 버전에서는 한 체널에서만 영상을 받아왔다면, 이번엔 지역 설정 (한국, 해외, 자동)을 통해 다양한 체널에서 받아오게끔 만들었습니다.
- 구글이 기본 제공하는 유튜브 검색 api 의 일일 한계치 때문에 여러명이 검색 요청을 보낸다면, 금방 한계치에 도달해버려서 더이상 검색이 안되는 문제가 있었습니다. 다행이 yt-search 라는 써드파티 라이브러리를 통해서 해결 됬습니다. 그러므로 따로 API 키를 발급받는 복잡한 과정을 거치지 않아도 됩니다.

## 아직 부족한 점 / 해결할 점
- 일단 크롬은 자동재생이 안되기에 여전히 파이어폭스를 사용해야 합니다. video-js 라는 라이브러리를 쓰면 된다고 하나, 복잡해서 나중에 다시 시도해볼 예정입니다.
- yt-search 라이브러리가 국가에 따라서 검색결과가 제한된거나 바뀝니다. 국가에 상관없이 동일한 결과를 얻을수 있는 라이브러리가 있으면 한번 시도해 보겠습니다. 
- yt-dlp 의 고질병? 같은게 최근에 생겼습니다. 유튜브 로그인이 되어있지 않으면 스트림 url을 얻을수 없습니다. 그러므로 브라우저에서 쿠키를 추출해서 명령줄에 --cookies 또는 --cookies-from-browser 를 사용해 넣어줘야 합니다. 하지만이게 또 기기마다 다르고, 윈도우에서는 제대로 작동이 안되고, 일부 브라우저만 제대로 된다는 점에서 좀 불안정하지 않나 싶습니다. 이것도 대체가능한 라이브러리가 필요합니다. 

## 스크린샷
업로드 예정


## 설치
### 준비물
우선 node.js, git 그리고 python이 필요합니다.

그리고 아래 명렁어를 이용해 yt-dlp 를 설치합니다.

`pip install yt-dlp`

만약 이미 설치 하셨다면, 아래 명령어로 최신 버전으로 업데이트 해주세요.

`pip install --upgrade yt-dlp`

아래 명령어로 clone 합니다.

`git clone https://github.com/jason8098/yt-karaoke-new`

필요 node 패키지를 설치 합니다.

`npm install`

실행합니다. 

`node app.js`

곡 검색/예약 등은 브라우저에 localhost:3000, 플레이어는(firefox) localhost:3000/player 로 가시면 됩니다.


# English version
# Youtube Karaoke Improved

## Introduction
This is an improved version of [Youtube Karaoke](https://github.com/jason8098/yt_karaoke)
This time, I have used node.js and express.js as a base language.

## Updated Features
- Added filesize arguments in the yt-dlp command line so that it is optimised for the speed.
- Fixed websocket routings for better latency.
- Reverted back the cancel function in the control page to th main list.
- QR code is generated according automatically to the server URL. 
- Improved search algoritm (Separate TJ, KY, International Channels + Auto detect the input language + fixed bugs for outputting wrong results)

## Improved/Added Features
- For data transfer, websocket (socket.io) is used. I changed it since the original regular POST method with PHP was unstable and server-client syncing was not efficient.
- There was a problem with the copyright issue when a youtube video is embeded, preventing it from being played. So I have implemented YT-DLP which will get the direct stream URL of the video.
- Also, users can set their preferrences for the languages and regions. 
- This version have a capability to get search queries from multiple channels through the region settings (Auto, Internatoinal, Korea)
- Google's youtube api has limited quota, so it easily reaches its limit when multiple users send queries. I overcame this issue with the yt-search library. Also you don't need to get an API key, which is really nice.  

## Things lacking/needs to be improved
- Chrome doesn't support video autoplay, so you still need to use Firefox. I could use video-js to solve it (let's try it later cuz it's too complex)
- yt-search lib sometimes doesn't return correct results depending on the regions. I will try different lib or maybe optimise the search algorithm.
- There is a stupid problem discovered recently due to chnage in youtube policy, where you need to be logged in aat least once in youtube. This generates a cookie so that yt knows that you are not a robot. If not, getting stream url won't work. To overcome this, you need to extract the cookies from the actual browser and import to yt-dlp using --cookies or --cookies-from-browser parameters. But the facct that this differs thoughout the other devices, and it kinda doesn't work in Windows, also it works on certain browsers makes this alternative method unstable. It needs other replacable libraries.

## Screenshots
Will be uploaded soon


## Installation 
### Steps
First, you need git, node.js and python.

Install yt-dlp using this.

`pip install yt-dlp`

If it is already installed, please upgrade to the latest version by typing the following:

`pip install --upgrade yt-dlp`

Clone the repo with this.

`git clone https://github.com/jason8098/yt-karaoke-new`

Install node package requirements.

`npm install`

Run the app.

`node app.js`

For clients, go to: localhost:3000, For player(firefox) localhost:3000/player