import LoadingComponent from 'components/LoadingComponent';
import LayeredCanvasComponent from 'components/LayeredCanvasComponent';
import { useState } from 'react';

const HomeComponent = () => {
	const [loading, setLoading] = useState(true);

	return (
		<div>
			{loading && <LoadingComponent />}
			<LayeredCanvasComponent setLoading={setLoading} />
		</div>
	);
};

export default HomeComponent;
