import axios from "axios";
import { useEffect, useState } from "react";
import { getNumber } from "../utils/formatting";
import '../App.css'

function CuotasForm() {

  const [ tna, setTna ] = useState(75)
  const [ limite, setLimite ] = useState(200)
  const [ impuesto, setImpuesto ] = useState(65)
  const [ sueldo, setSueldo ] = useState(0)
  const [ monto, setMonto ] = useState(0)
  const [ cuotas, setCuotas ] = useState(1)
  const [ tnaTarjeta, setTnaTarjeta ] = useState(0)
  const [ dolar, setDolar ] = useState([])

  const date = new Date()
  const hoy =  date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  const hace1Y =  (date.getFullYear()-1)+'-'+(date.getMonth()+1)+'-'+date.getDate()
  const hace1d =  date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-1)

  const getDolarDia = (type, date) => {
    date = date || hoy
    let anterior = null
    const res = dolar.findIndex((v,i) => {
        const res = v.source === type && v.date === date
        anterior = i
        if (!res && v.source === type && v.date < date)
            return true
        return res
    })
    return (dolar[res]?.date > date) ? dolar[anterior] : dolar[res]
  }

  useEffect(() => {
    const getDolar = async () => {
        axios.get('https://api.bluelytics.com.ar/v2/evolution.json')
        .then(res => setDolar(res.data))
        .catch(err => console.error(err))
    }
    getDolar()
  }, [])

  const tnaToTem = (t) => t * 30/365
  const temToTna = (t) => t * 365/30  

  const tem = tnaToTem(tna)
  const tea = ((1+tem/100)**12-1)
  const temTarjeta = 0 //((1+tnaTarjeta)**(1/12) - 1)*100//tnaToTem(tnaTarjeta)*100
// CFT = CFTEA = 3.3
// CFTEM = ((1+CFTEA)^(1/12)-1)*100
// CFT = CUOTA*n/(monto)-1

// 3.3*73899-73899*12.924724/9 =
  const cuotaBase = monto / cuotas
  let coefInteres = 0
  for (let i=1; i<=cuotas; i++) {
    //coefInteres += (1+temTarjeta/100)**i//*(1-tem)**i //+ (1-temTarjeta/100)**i
    coefInteres += (1-tem/100)**i
  }
  const montoEnCuotas = coefInteres * cuotaBase
  const equivCuotas = montoEnCuotas / monto
  const equiv1Cuota = monto * cuotas / coefInteres

  const dolarBase = getDolarDia('Oficial')?.value_sell
  const dolarOficial = dolarBase * (1+impuesto/100)
  const dolarOficial1Y = getDolarDia('Oficial', hace1Y)?.value_sell * (1+impuesto/100)
  const dolarBlue = getDolarDia('Blue')?.value_sell
  const dolarBlue1d = getDolarDia('Blue', hace1d)?.value_sell

  const miCompraLimite = sueldo > limite*dolarOficial ? limite*dolarOficial : sueldo
  const sueldoUSD = (sueldo-(miCompraLimite))/dolarBlue+miCompraLimite/dolarOficial

  return (
    <div style={{padding: 20}}>
      <form>
        <div className="panel config">
            <table className="config"><tbody>
                <tr>
                  <td>TNA (%)</td>
                  <td>Sueldo neto</td>
                  <td>Limite compra USD</td>
                  <td>Imp. compra USD (%)</td>
                </tr>
                <tr>
                    <td><input value={tna} type="number" step="0.01" onChange={event => setTna(parseFloat(event.target.value) || 0)} /></td>
                    <td><input value={sueldo} type="number" step="0.01" onChange={event => setSueldo(parseFloat(event.target.value || 0))} /></td>
                    <td><input value={limite} type="number" step="0.01" onChange={event => setLimite(event.target.value ? parseFloat(event.target.value) : null)} /></td>
                    <td><input value={impuesto} type="number" step="0.01" onChange={event => setImpuesto(event.target.value ? parseFloat(event.target.value) : null)} /></td>
                </tr>
            </tbody></table>
        </div>
        <h3 style={{margin: 0}}>Cálcular financiación</h3>
        <table className="form"><tbody>
            <tr><td>Monto</td><td><input value={monto} type="number" step="0.01" onChange={event => setMonto(parseFloat(event.target.value))} /></td></tr>
            <tr><td>Cuotas</td><td><input value={cuotas} type="number" onChange={event => setCuotas(parseInt(event.target.value || 1))} /></td></tr>
            <tr><td>Interés (%)</td><td style={{fontSize:'0.8em'}}>
              TNA <input value={tnaTarjeta} title="TNA" type="number" step="0.01" onChange={event => setTnaTarjeta(parseFloat(event.target.value || 0))} style={{width: "40px"}} /> /
              {/*TEM <input value={temTarjeta} title="TEM" type="number" step="0.01" onChange={event => setTnaTarjeta(parseFloat(temToTna(event.target.value || 0))/100)} style={{width: "40px"}} />*/}
            </td></tr>
        </tbody></table>
      </form>
      <hr />
      <table className="form"><tbody>
        <tr><td>Monto:</td><td>${getNumber(monto)}</td></tr>
        {sueldo > 0 && <tr>
          <td>Sueldo:</td>
          <td>${getNumber(sueldo)} (U$S={getNumber(sueldoUSD)})</td>
        </tr> }
        {/*<tr><td>Interés mensual PF:</td><td>${getNumber(monto*tem)} (TEM: {getNumber(tem*100)}% | U$S {getNumber(monto*tem/dolarBlue)})</td></tr>*/}
        <tr>
          <td>Interés mensual:</td>
          <td>${getNumber(monto*tem/100*(1+temTarjeta/100))} (TEM: {getNumber((1+temTarjeta/100)*tem)}% | U$S {getNumber(monto*(1+temTarjeta/100)*tem/100/dolarBlue)})</td>
        </tr>
        <tr>
          <td>Final en cuotas:</td>
          <td>${getNumber(montoEnCuotas)} ({getNumber((equivCuotas-1)*100)}%{sueldo>0 && ` | ${getNumber(montoEnCuotas/sueldo*100)}% de mi sueldo, ${getNumber(sueldo/montoEnCuotas)}`})</td>
        </tr>
        <tr>
          <td>Equiv. en {cuotas} cuota{cuotas>1?'s':''}:</td>
          <td>${getNumber(equiv1Cuota)} ({getNumber((equiv1Cuota/monto-1)*100)}%)</td>
        </tr>
        <tr>
          <td>Dólar Oficial:</td>
          <td>${getNumber(dolarBase)} {impuesto>0 && `+${impuesto}% = $${getNumber(dolarOficial)}`} (<span title={`$${getNumber(dolarOficial1Y)}`}>{getNumber((dolarOficial/dolarOficial1Y-1)*100)}% respecto año anterior</span>)</td>
        </tr>
        <tr>
          <td>Dólar Blue:</td>
          <td>${getNumber(dolarBlue)} (${getNumber(limite*(dolarBlue-dolarOficial))} = {getNumber(dolarBlue/dolarOficial*100-100)}% | {getNumber(dolarBlue-dolarBlue1d)} {getNumber(dolarBlue/dolarBlue1d*100-100)}%)</td>
        </tr>
        <tr>
          <td>TEA:</td>
          <td>{getNumber(tea*100)}% (equivale a que el dólar varíe {getNumber(dolarOficial*(1+tea)/dolarBlue*100-100)}% a ${getNumber(dolarOficial*(1+tea))})</td>
        </tr>
      </tbody></table>
      {temTarjeta}
    </div>
  );
}

export default CuotasForm;
