import { globalIgnores } from 'eslint/config'

export default [
  globalIgnores(['dist', 'source_package', '**/components/ui/**']),
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
]
