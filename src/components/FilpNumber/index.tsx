import { CSSProperties, Fragment, ReactNode, useEffect, useState } from "react"

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

const RotatoNumber = (props: RotatoNumberProps) => {
    const { number: PorpsNumber, className = "", style, color = "#fff", delay = 1000, render } = props

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
        <div className={className} style={{ display: "flex", gap: 8, ...style }}>
            {numberList.map((digit, index) => {
                return <Fragment key={index}>{render ? render(<div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s` }}>{digit}</div>) : <div style={{ transformOrigin: "center", transform: `${`rotate3d(1,0,0,${angle[index]}deg)`}`, color, transition: `transform ${delay / 1000}s` }}>{digit}</div>}</Fragment>
            })}
        </div>
    )
}

export default RotatoNumber
