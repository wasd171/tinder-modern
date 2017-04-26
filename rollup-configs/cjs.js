import shared from './shared'

const config = Object.assign({}, shared, {
	format: 'cjs',
	dest: 'dist/bundle.js'
})

export default config
