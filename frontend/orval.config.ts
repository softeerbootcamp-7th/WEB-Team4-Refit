import { defineConfig } from 'orval'

/**
 * 점진적 마이그레이션을 위한 orval 설정
 * 
 * 각 OpenAPI 파일은 별도의 설정으로 관리
 * 실제 서버가 준비되면 해당 파일의 baseUrl을 실제 서버 URL로 변경
 */
export default defineConfig({
  // Mock API (초기)
  'petstore-mock': {
    input: './petstore.yaml',
    output: {
      mode: 'tags-split',
      target: 'src/api/petstore.ts',
      client: 'react-query',
      prettier: true,
      mock: true,
    },
  },

  // 실제 서버가 준비된 API 예시
  // 실제 서버가 준비되면 아래 설정을 활성화하고 baseUrl을 설정
  // 'petstore-real': {
  //   input: './petstore-real.yaml', // 실제 서버의 OpenAPI 스펙
  //   output: {
  //     mode: 'tags-split',
  //     target: 'src/api/petstore-real.ts',
  //     client: 'react-query',
  //     prettier: true,
  //     mock: false, // 실제 서버는 mock 없음
  //     baseUrl: 'https://api.example.com', // 실제 서버 URL
  //   },
  // },

  // 다른 API 서비스 예시
  // 'users-api': {
  //   input: './users-api.yaml',
  //   output: {
  //     mode: 'tags-split',
  //     target: 'src/api/users/index.ts',
  //     client: 'react-query',
  //     prettier: true,
  //     mock: true,
  //   },
  // },
})
