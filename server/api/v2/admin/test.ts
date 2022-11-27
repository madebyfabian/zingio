export default defineEventHandler(async event => {
	const startTime = +new Date()
	console.log(startTime, 'start')

	console.log(+new Date(), 'end', { took: +new Date() - startTime })
	return true
})
