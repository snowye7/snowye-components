import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"

export interface TriangleProps {
    width: number
    height: number
    color: string
    className?: string
    style?: React.CSSProperties
    direction?: "up" | "down" | "left" | "right"
}

export const Triangle = forwardRef<SVGSVGElement, TriangleProps>((props: TriangleProps, ref: ForwardedRef<SVGSVGElement>) => {
    const { width, height, color, direction = "up", className, style } = props

    const svgRef = useRef<SVGSVGElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return svgRef.current!
        },
        []
    )

    const points = {
        down: `0,0 ${width},${0} ${width / 2},${height}`,
        up: `0,${height} ${width / 2},0 ${width},${height}`,
        left: `${width},0 ${width},${height} 0,${height / 2}`,
        right: `0,0 ${width},${height / 2} 0,${height}`
    }
    return (
        <svg ref={svgRef} className={className} style={style} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <polygon points={points[direction]} fill={color} />
        </svg>
    )
})

