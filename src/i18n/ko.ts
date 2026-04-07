export const ko = {
  header: {
    title: 'BPM 동기화 루프 배경화면 생성기',
    bpm: 'BPM',
    export: '비디오 추출',
    guide: '사용 가이드',
  },
  sidebarLeft: {
    title: '패턴 라이브러리',
    patterns: {
      PolkaDots: '물방울 무늬 (Polka Dots)',
      DiagonalStripes: '사선 무늬 (Stripes)',
      BouncingColorBar: '바운싱 바 (Bouncing Bar)',
      ParticleRain: '파티클 비 (Particle Rain)',
    }
  },
  sidebarRight: {
    title: '속성 패널',
    globalSettings: '전역 설정',
    chromaKey: '크로마키 배경색',
    aspectRatio: '화면 비율',
    resolution: '출력 해상도',
    includeAudio: '비디오에 오디오 포함',
    layerSettings: '레이어 설정',
    noLayerSelected: '선택된 레이어가 없습니다',
    selectLayerPrompt: '캔버스에서 레이어를 선택하여 속성을 편집하세요.',
    deleteLayer: '삭제',
    baseColor: '기본 색상',
    autoPalette: '자동 배색 추천 (chroma.js)',
    patternSize: '패턴 크기',
    rotation: '회전 각도',
    speed: '애니메이션 속도 (BPM 배수)',
    paletteTypes: {
      analogous: '유사색 (Analogous)',
      complementary: '보색 (Complementary)',
      triadic: '삼각 배색 (Triadic)',
      monochromatic: '단색/톤온톤 (Monochromatic)'
    },
    polkaDots: {
      grouping: '도트 그룹핑',
      groupingUnified: '1: 단일 파라미터 (Unified)',
      groupingAlternating: '2: 교차 파라미터 (Alternating)',
      animType: '애니메이션 타입',
      animSlide: '1: 슬라이드 (Slide)',
      animWave: '2: 웨이브 (Wave)',
      slideSpeed: '슬라이드 이동 속도',
      slideDirection: '슬라이드 이동 방향',
      scale1: '스케일 1 (기본/짝수)',
      scale2: '스케일 2 (홀수)',
    },
    particleRain: {
      layer1: '배경 (BG)',
      layer2: '중경 (MG)',
      layer3: '전경 (FG)',
      shapeType: '파티클 모양',
      shapes: { 
        Circle: '원', 
        Triangle: '삼각형', 
        Diamond: '마름모', 
        Star: '별', 
        Snowflake: '눈꽃',
        Hexagon: '육각형',
        Heart: '하트',
        Cross: '십자가',
        Pixel: '픽셀 (사각형)',
        '8bitHeart': '8비트 하트',
        '8bitStar': '8비트 별',
        '8bitInvader': '8비트 인베이더'
      },
      count: '파티클 개수',
      speed: '낙하 속도',
      opacity: '투명도',
      sizeRange: '크기 범위 (Min - Max)',
      bpmSync: 'BPM 동기화 효과',
      syncNone: '없음',
      syncPulse: '크기/투명도 펄스',
      syncBurst: '속도 버스트',
    }
  },
  timeline: {
    uploadAudio: '오디오 업로드',
    removeAudio: '오디오 제거',
    play: '재생 (Space)',
    pause: '일시정지 (Space)',
    currentTime: '현재 시간',
  },
  guide: {
    title: '사용 방법 가이드',
    step1: '1. 좌측 패널에서 원하는 패턴을 클릭하여 캔버스에 추가하세요.',
    step2: '2. 캔버스에서 패턴을 클릭하고 드래그하여 위치, 크기, 회전을 조절하세요. (마우스 휠: 줌, 휠 클릭: 이동)',
    step3: '3. 우측 패널에서 크로마키 배경색, 화면 비율, 해상도를 설정하세요.',
    step4: '4. 우측 패널에서 선택된 레이어의 색상, 패턴 크기, 애니메이션 속도를 조절하세요.',
    step5: '5. 하단 타임라인에서 오디오를 업로드하고 스페이스바로 재생하며 미리보기를 확인하세요.',
    step6: '6. [비디오 추출] 버튼을 눌러 루프 영상을 다운로드하세요. (Step 5에서 구현 예정)',
    shortcuts: '단축키: [Space] 재생/일시정지, [Delete] 레이어 삭제, [Ctrl+Z] 실행 취소, [Ctrl+Y] 다시 실행',
    close: '닫기'
  }
};



