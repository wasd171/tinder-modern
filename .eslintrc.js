module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:flowtype/recommended',
        'prettier',
        'prettier/flowtype'
    ],
    env: {
        es6: true,
        browser: true,
        node: true
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    plugins: [
        'flowtype',
        'prettier'
    ],
    rules: {
        'flowtype/delimiter-dangle': ['warn', 'never'],
        'flowtype/no-dupe-keys': 'error',
        'flowtype/no-primitive-constructor-types': 'error',
        'flowtype/no-types-missing-file-annotation': 'error',
        'flowtype/no-weak-types': 'warn',
        'flowtype/require-valid-file-annotation': ['error', 'always'],
        'flowtype/require-variable-type': 'error',
        'flowtype/require-parameter-type': ['error', {
            excludeArrowFunctions: true
        }],
        'flowtype/sort-keys': ['warn', 'asc', {
            natural: true
        }],
        'flowtype/type-id-match': 'warn',
        'prettier/prettier': ['error', {
            useTabs: true,
            tabWidth: 4,
            singleQuote: true,
            semi: false
        }]
    },
    settings: {
        flowtype: {
            onlyFilesWithFlowAnnotation: true
        }
    }
}