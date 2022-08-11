// import CanvasComponent from 'components/CanvasComponent';
import LoadingComponent from 'components/LoadingComponent';
// import MoreCanvasComponent from 'components/MoreCanvasComponent';
import LayeredCanvasComponent from 'components/LayeredCanvasComponent';
import { useState } from 'react';
import styles from './HomeComponent.module.scss';

const HomeComponent = () => {
	const [loading, setLoading] = useState(true);

	return (
		<div className={styles.container}>
			<div className={styles.container}>
				{loading && <LoadingComponent />}
				{/* <CanvasComponent setLoading={setLoading} /> */}
				{/* <MoreCanvasComponent setLoading={setLoading} /> */}
				<LayeredCanvasComponent setLoading={setLoading} />
			</div>
		</div>
	);
};

export default HomeComponent;
