import {useEffect, useRef, useState} from "react";

export const PriceRange = (props) => {
    const {minV, maxV} = props  //cheapest product, most expensive product
    const onChangePrices = props.onChangePrices || function(){};
    const targetRef = useRef()  //saves the current click target
    const leftRef = useRef(0) // % position of left handle
    const rightRef = useRef(100) // % position of right handle
    const slideWrapperRef = useRef() //allows skipping invoking document.querySelector
    const [draggable, setDraggable] = useState(false)
    const [price, setPrice] = useState([minV, maxV])
    const [sliderStyle, setSliderStyle] = useState({
        selectedSliderLeft: 0,
        selectedSliderWidth: 100,
        handleOne: 0,
        handleTwo: 100,
    })
    const styles = {
        priceSliderSelected: {
            left: sliderStyle.selectedSliderLeft + '%',
            width: sliderStyle.selectedSliderWidth + '%',
        },
        handleOne: {
            left: sliderStyle.handleOne + '%',
        },
        handleTwo: {
            left: sliderStyle.handleTwo + '%',
        }
    }
    //used to export price values
    useEffect(() => {
        onChangePrices(price)
    },[price])
    useEffect(() => {
        setSliderStyle(sliderStyle)
    },[sliderStyle])
    useEffect(() => {

    })
    useEffect(() => {

    })
    const calculateLeftMargin = (cursorV,allV,maxWidth) => {
        cursorV = (allV - cursorV.toFixed(0)) * 100 / maxWidth
        cursorV = 100 - cursorV          //flip the %
        if (cursorV < 0) cursorV = 0     //prevent the user from sliding off the rail
        if(cursorV > 100) cursorV = 100
        if(targetRef.current.tabIndex === 0){
            leftRef.current = cursorV
            if(+leftRef.current < +rightRef.current - 8){
                setSliderStyle({
                    ...sliderStyle,
                    selectedSliderLeft:cursorV,
                    handleOne: cursorV,
                    selectedSliderWidth: sliderStyle.handleTwo - cursorV,
                })
                calculatePrice(leftRef.current,1)
            }
        }
        else if (targetRef.current.tabIndex === 1) {
            rightRef.current = cursorV
            if (+leftRef.current < +rightRef.current - 8){
            setSliderStyle({
                ...sliderStyle,
                handleTwo: cursorV,
                selectedSliderWidth: cursorV - sliderStyle.handleOne
            })
            calculatePrice(rightRef.current,2)
        }
        }
    }

    const calculatePrice = (margin, check) => {
        const x = maxV - minV
        margin = (margin / 100).toFixed(2)
        //check which handle is being moved
        if(check === 1){
            const y = (+margin * x).toFixed(0)
            const z =+minV + +y
            setPrice([z,price[1]])
        }
        else if(check === 2){
            const y = x - (+margin * x).toFixed(0)
            const z = +maxV - +y
            setPrice([price[0],z])
        }
    }

    const handleClick = (e) => {
        const handleOnePosition = slideWrapperRef.current.querySelector('.handleOne')
        const handleTwoPosition = slideWrapperRef.current.querySelector('.handleTwo')
        let x = e.clientX - handleOnePosition.getBoundingClientRect().left
        let y = handleTwoPosition.getBoundingClientRect().left - e.clientX
        x < y
            ? targetRef.current = handleOnePosition
            : targetRef.current = handleTwoPosition
            calculatePosition(e)
        }

    const calculatePosition = (e, mobileCheck) => {
        let bar = document.querySelector('.priceSliderAll').getBoundingClientRect()
        let z = bar.right
        let w = bar.width
        let targetX = 0
        if(mobileCheck){
            let touch = e?.touches[0]
            targetX = touch.pageX
        }
        else targetX = e.clientX
        calculateLeftMargin(targetX,z,w)
    }

    const handleMouseDown = (e) => {
        if (e.button !== 0) return
        setDraggable(true)
        targetRef.current = e.target
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener("mousemove", handleMouseOut);
    }
    const handleMouseOut = (e) => {
        calculatePosition(e)
    }
    const handleMouseUp = () => {
        setDraggable(false);
        window.removeEventListener('mousemove', handleMouseOut, false)
        window.removeEventListener('mouseup', handleMouseUp)
    }
    const handleTouchStart = (e) => {
        targetRef.current = e.target
        targetRef.current.addEventListener('touchend', handleTouchEnd)
        targetRef.current.addEventListener("touchmove", handleTouchMove);
    }
    const handleTouchMove = (e) => {
        calculatePosition(e, true)
    }
    const handleTouchEnd = () => {
        targetRef.current.removeEventListener('touchend', handleTouchEnd)
        targetRef.current.removeEventListener('touchmove', handleTouchMove)
    }

    const handleBlur = (e) => {
        let result = ((+e.target.value - minV) / (maxV - minV) * 100).toFixed(2)
        if(result < 0) result = 0
        if(result > 100) result = 100
        // result = Math.min(100, Math.max(result, 0))
        if(e.target.closest('input').className === 'minValue'){
            (+price[0] < minV) && (price[0] = minV)
            if(+e.target.value > +price[1]){
                (+e.target.value > maxV) && (e.target.value = +maxV)
                setPrice([price[1] , e.target.value])
                leftRef.current = sliderStyle.handleTwo
                rightRef.current = +((+price[0] - minV) / (maxV - minV) * 100).toFixed(2)
                setSliderStyle({
                    selectedSliderLeft:sliderStyle.handleTwo,
                    handleOne: sliderStyle.handleTwo,
                    handleTwo: result,
                    selectedSliderWidth: result - sliderStyle.handleTwo
                })
            }
            else{
                setSliderStyle({
                    ...sliderStyle,
                    selectedSliderLeft:result,
                    handleOne: result,
                    selectedSliderWidth: sliderStyle.handleTwo - result,
                })
            }
        } else { //if input.className === maxValue
            (+price[1] > maxV) && (price[1] = maxV)
            if (+e.target.value < +price[0]) {
                (+e.target.value < minV) && (e.target.value = +minV)
                setPrice([e.target.value, price[0]])
                leftRef.current = +result
                rightRef.current = +((+price[0] - minV) / (maxV - minV) * 100).toFixed(2)
                setSliderStyle({
                    selectedSliderLeft:result,
                    selectedSliderWidth: sliderStyle.handleOne - result,
                    handleOne: result,
                    handleTwo: sliderStyle.handleOne,
                })
            }
            else {
                setSliderStyle({
                    ...sliderStyle,
                    handleTwo: result,
                    selectedSliderWidth: result - sliderStyle.handleOne
                })
            }
        }
    }

    const handleInputChange = (e) => {
        const msg = +(e.target.closest('input').className === 'maxValue')
        !msg ?
            setPrice([e.target.value, price[1]])
            :
            setPrice([price[0], e.target.value])
    }

    const PricePoint = (props) => {
        const {tabIndex, className, style} = props
        return(
            <span tabIndex={tabIndex}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  className={className} style={style}></span>
        )
    }
    return (
        <div  ref={slideWrapperRef} className='priceSliderWrapper'>
            <div className='inputWrapper'>
                <input onBlur={handleBlur} type='number'  className='minValue' onChange={handleInputChange} value={price[0]}/>
                <span>-</span>
                <input onBlur={handleBlur} type='number'  className='maxValue' onChange={handleInputChange} value={price[1]}/>
            </div>
            <div className="priceSliderAllWrapper" onClick={handleClick}>
                <div className="priceSliderAll"></div>
                <div className="priceSliderSelected" style={styles.priceSliderSelected}></div>
            </div>
            <input type="hidden" value={[price[0], price[1]]}/>
            <PricePoint tabIndex='0' className='priceSliderSet handleOne' style={styles.handleOne} />
            <PricePoint tabIndex='1' className='priceSliderSet handleTwo' style={styles.handleTwo} />
        </div>
    )
}