import { CSSProperties, ForwardedRef, Fragment, HTMLAttributes, ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export type RotatoNumberProps = {
    number: number
    style?: CSSProperties
    itemStyle?: CSSProperties
    className?: string
    color?: string
    /**
     * 位数
     */
    digit?: number
    /**
     * 旋转的时间
     */
    delay?: number
    render?: (node: ReactNode) => ReactNode
} & HTMLAttributes<HTMLDivElement>

export function padZero(num: number, digit: number) {
    return num.toString().padStart(digit, "0")
}

export const RotatoNumber = forwardRef<HTMLDivElement, RotatoNumberProps>((props: RotatoNumberProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { number: PorpsNumber, className = "", style, color, delay = 1000, render, itemStyle, ...rest } = props

    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return containerRef.current!
        },
        []
    )

    const [number, setNumber] = useState(PorpsNumber)

    const digit = Math.max(number.toString().length, props.digit ?? 1)

    const [angle, setAngles] = useState<number[]>(Array.from({ length: digit }, () => 0))

    const numberList = padZero(number, digit).split("")

    useEffect(() => {
        const prevNumberList = padZero(PorpsNumber, digit).split("")

        let changeIndex: number[] = []

        for (let i = 0; i < numberList.length; i++) {
            if (numberList[i] !== prevNumberList[i]) {
                changeIndex.push(i)
            }
        }

        setAngles(prev => {
            if (prevNumberList.length !== prev.length) {
                return Array.from({ length: prevNumberList.length }, (_, i) => {
                    return prev[i] === 0 ? 360 : 0
                })
            }
            const newAngles = prev.map((v, i) => {
                if (changeIndex.includes(i)) {
                    return v === 0 ? 360 : 0
                }
                return v
            })
            return newAngles
        })
        setTimeout(() => {
            setNumber(PorpsNumber)
        }, Math.max(delay / 2, 100))
    }, [PorpsNumber])

    return (
        <div ref={containerRef} className={className} style={{ display: "flex", ...style }} {...rest}>
            {numberList.map((digit, index) => {
                return <Fragment key={index}>{render ? render(<div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s`, ...itemStyle }}>{digit}</div>) : <div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s`, ...itemStyle }}>{digit}</div>}</Fragment>
            })}
        </div>
    )
})
