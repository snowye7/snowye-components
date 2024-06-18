import { css } from "@emotion/css"
import { CSSProperties, ForwardedRef, Fragment, ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { clsx } from "snowye-tools"

export type RotatoNumberProps = {
    number: number
    style?: CSSProperties
    className?: string
    color?: string
    digit?: number
    delay?: number
    render?: (node: ReactNode) => ReactNode
}

function padZero(num: number, digit: number) {
    return num.toString().padStart(digit, "0")
}

export const RotatoNumber = forwardRef<HTMLDivElement, RotatoNumberProps>((props: RotatoNumberProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { number: PorpsNumber, className = "", style, color = "#fff", delay = 1000, render } = props

    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return containerRef.current!
        },
        []
    )

    const [number, setFcNumber] = useState(PorpsNumber)

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
            const newAngles = prev.map((v, i) => {
                if (changeIndex.includes(i)) {
                    return v === 0 ? 360 : 0
                }
                return v
            })
            return newAngles
        })
        setTimeout(() => {
            setFcNumber(PorpsNumber)
        }, Math.max(delay / 2, 100))
    }, [PorpsNumber])

    return (
        <div
            ref={containerRef}
            className={clsx(
                css`
                    display: flex;
                    gap: 8px;
                `,
                className
            )}
            style={style}
        >
            {numberList.map((digit, index) => {
                return <Fragment key={index}>{render ? render(<div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s` }}>{digit}</div>) : <div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s` }}>{digit}</div>}</Fragment>
            })}
        </div>
    )
})
