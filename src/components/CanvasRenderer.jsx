import { Row, Col } from 'antd';
import { componentRegistry } from './renderers/componentRegistry';

const CanvasRenderer = ({ components }) => {
    return (
        <Row gutter={[16, 16]}>
            {components.map((component) => {
                const Renderer = componentRegistry[component.type];

                if (!Renderer) return null;

                return (
                    <Col
                        key={component.id}
                        span={component.layout?.span || 24}
                    >
                        <Renderer component={component} />
                    </Col>
                );
            })}
        </Row>
    );
};

export default CanvasRenderer;