# Figma import — Page 2 (sanxzj25)

Talk-to-Figma MCP 채널 `sanxzj25`에서 가져온 **Learners High** 와이어프레임 참조.

## 포함 파일

| 파일 | 설명 |
|------|------|
| `screens-manifest.json` | Frame ID ↔ PNG 경로 |
| `screens/*.png` | 6개 화면 @2x PNG (1280×1024) |

화면·nodeId 매핑: [docs/figma-file.md](../../docs/figma-file.md)  
성장 단계 에셋: [docs/design-tokens.md](../../docs/design-tokens.md) §4–5

## 갱신 방법

```bash
bun x cursor-talk-to-figma-socket   # 별도 터미널, Figma 플러그인 연결
npm run figma:import
```

토큰: `frontend/src/styles/tokens.css`
