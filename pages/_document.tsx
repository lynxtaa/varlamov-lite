import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
	render() {
		return (
			<Html lang="ru">
				<Head />
				<body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
