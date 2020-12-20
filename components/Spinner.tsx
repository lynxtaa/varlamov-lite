import { Loader } from 'react-feather'

import styles from './Spinner.module.css'

export default function Spinner() {
	return (
		<div className={styles.Spinner}>
			<Loader size="150px" />
		</div>
	)
}
