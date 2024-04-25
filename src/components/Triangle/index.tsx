export interface TriangleProps {
    width: number
    height: number
    color: string
    className?: string
    style?: React.CSSProperties
    direction?: "up" | "down" | "left" | "right"
}

const Triangle: React.FC<TriangleProps> = props => {
    const { width, height, color, direction = "up", className, style } = props

    const points = {
        down: `0,0 ${width},${0} ${width / 2},${height}`,
        up: `0,${height} ${width / 2},0 ${width},${height}`,
        left: `${width},0 ${width},${height} 0,${height / 2}`,
        right: `0,0 ${width},${height / 2} 0,${height}`
    }
    return (
        <svg className={className} style={style} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <polygon points={points[direction]} fill={color} />
        </svg>
    )
}

export default Triangle
