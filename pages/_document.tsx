import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

import { themeStorageKey } from '../lib/theme'

class MyDocument extends Document {
	render() {
		return (
			<Html lang="ru">
				<Head />
				<body>
					<script
						dangerouslySetInnerHTML={{
							__html: `(function() {
                try {
                  var mode = localStorage.getItem('${themeStorageKey}')
                  if (!mode) {
                    return
                  }
									document.documentElement.classList.add(mode)
                } catch (e) {}
              })()`,
						}}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
