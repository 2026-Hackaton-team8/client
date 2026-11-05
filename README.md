# client

> 프로젝트 소개를 작성해 주세요.

## 기술 스택

| 구분      | 사용 기술                   |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript, React 19        |
| Styling   | Tailwind CSS v4, Pretendard |
| Lint      | ESLint 9, Prettier          |
| 구조      | Feature-Sliced Design (FSD) |

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 스크립트

| 명령어          | 설명           |
| --------------- | -------------- |
| `npm run dev`   | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드  |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint`  | ESLint 검사    |

## 폴더 구조

```
app/            # Next.js 라우팅 파일 (page.tsx, layout.tsx)
pages/          # 비워 둠 (src/pages가 Pages Router로 인식되지 않게 하는 용도)
public/         # 정적 파일
src/
  app/          # 전역 설정, 프로바이더, 전역 스타일
  pages/        # 페이지 단위 조합
  widgets/      # 독립적인 큰 UI 블록
  features/     # 사용자 기능 (버튼 클릭, 폼 제출 등)
  entities/     # 비즈니스 엔티티
  shared/       # 공용 UI, 유틸, API 클라이언트, 설정
```

- 상위 레이어는 하위 레이어만 import 할 수 있습니다. (`app → pages → widgets → features → entities → shared`)
- 각 슬라이스는 `index.ts`로만 외부에 노출합니다.
- 경로 별칭 `@/*`는 `src/*`를 가리킵니다.

## 디자인 토큰

`src/app/styles/globals.css`의 `@theme`에 정의되어 있습니다. hex 값이나 `text-[13px]` 같은 임의값 대신 토큰을 사용합니다.

**Color**

- Primary: `primary-50` ~ `primary-600`
- Secondary: `secondary-50` ~ `secondary-900`

**Typography** (크기, 굵기, 행간이 한 클래스에 포함)

| 클래스                                 | 용도                      |
| -------------------------------------- | ------------------------- |
| `text-display-xl`                      | 랜딩 메인 문구            |
| `text-heading-xl` · `lg` · `md` · `sm` | 페이지 · 섹션 · 카드 제목 |
| `text-title-lg` · `md`                 | 강조 · 일반 제목          |
| `text-body-lg` · `md` · `sm`           | 본문 · 설명               |
| `text-label-lg` · `md`                 | 버튼, 입력 라벨, 태그     |
| `text-caption`                         | 날짜, 부가 정보           |

```tsx
<h1 className="text-heading-xl text-secondary-900">페이지 제목</h1>
```

## 컨벤션

### 브랜치

`main`에서 `type/설명` 형식으로 브랜치를 만들고 PR로 머지합니다.

```
feat/design-token
fix/login-error
```

### 커밋

```
type :: 한글 설명
```

| 타입       | 설명                      |
| ---------- | ------------------------- |
| `feat`     | 새로운 기능               |
| `fix`      | 버그 수정                 |
| `refactor` | 기능 변경 없는 코드 개선  |
| `style`    | UI, 스타일 변경           |
| `chore`    | 설정, 패키지 등 기타 작업 |
| `docs`     | 문서 수정                 |
| `test`     | 테스트 추가·수정          |

### PR

`.github/pull_request_template.md` 양식에 맞춰 작성합니다. 올리기 전에 아래 명령어가 모두 통과해야 합니다.

```bash
npm run lint
npx tsc --noEmit
npx prettier --check .
```

자세한 작업 규칙은 [AGENTS.md](./AGENTS.md)를 참고하세요.
