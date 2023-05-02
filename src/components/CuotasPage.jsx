import axios from "axios";
import { useEffect, useState } from "react";
import { getNumber } from "../utils/formatting";
import "../App.css";

const GeneralForm = ({ state }) => (
    <table className="config">
      <tbody>
        <tr>
          <td>TNA (%)</td>
          <td>Sueldo neto</td>
          <td>Limite compra USD</td>
          <td>Imp. compra USD (%)</td>
        </tr>
        <tr>
          <td>
            <input
              value={state.tna}
              type="number"
              step="1"
              onChange={state.changeTna}
            />
          </td>
          <td>
            <input
              value={state.sueldo}
              type="number"
              step="1"
              onChange={state.changeSueldo}
            />
          </td>
          <td>
            <input
              value={state.limite}
              type="number"
              step="1"
              onChange={state.changeLimite}
            />
          </td>
          <td>
            <input
              value={state.impuesto}
              type="number"
              step="1"
              onChange={state.changeImpuesto}
            />
          </td>
        </tr>
      </tbody>
    </table>
);

const CuotasForm = ({ state }) => {
    return (
<form>
    <h3 style={{ margin: 0 }}>Cálcular financiación</h3>
    <table className="form">
    <tbody>
        <tr>
        <td>Monto</td>
        <td>
            <input
            value={state.monto}
            type="number"
            step="1"
            onChange={state.changeMonto}
            />
        </td>
        </tr>
        <tr>
        <td>Cuotas</td>
        <td>
            <input
            value={state.cuotas}
            type="number"
            onChange={state.changeCuotas}
            />
        </td>
        </tr>
        <tr>
        <td>Interés (%)</td>
        <td style={{ fontSize: "0.8em" }}>
            TNA{" "}
            <input
            value={state.tnaTarjeta}
            title="TNA"
            type="number"
            step="1"
            onChange={state.changeTnaTarjeta}
            style={{ width: "40px" }}
            />{" "}
            /
            {/*TEM <input value={state.temTarjeta} title="TEM" type="number" step="1" onChange={event => setTnaTarjeta(parseFloat(temToTna(event.target.value || 0))/100)} style={{width: "40px"}} />*/}
        </td>
        </tr>
    </tbody>
    </table>
</form>
)};

const CuotasFormResults = ({state}) => {
    const { sueldo, sueldoUSD, monto, tea, tem, temTarjeta, dolarBlue, montoEnCuotas, equiv1Cuota, equivCuotas, dolarOficial, cuotas, dolarBase, impuesto, dolarOficial1Y, limite, dolarBlue1d } = state
    return (
<table className="form">
    <tbody>
    <tr>
        <td>Monto:</td>
        <td>${getNumber(monto)}</td>
    </tr>
    {sueldo > 0 && (
        <tr>
        <td>Sueldo:</td>
        <td>
            ${getNumber(sueldo)} (U$S={getNumber(sueldoUSD)})
        </td>
        </tr>
    )}
    {/*<tr><td>Interés mensual PF:</td><td>${getNumber(monto*tem)} (TEM: {getNumber(tem*100)}% | U$S {getNumber(monto*tem/dolarBlue)})</td></tr>*/}
    <tr>
        <td>Interés mensual:</td>
        <td>
        ${getNumber(((monto * tem) / 100) * (1 + temTarjeta / 100))} (TEM:{" "}
        {getNumber((1 + temTarjeta / 100) * tem)}% | U$S{" "}
        {getNumber(
            (monto * (1 + temTarjeta / 100) * tem) / 100 / dolarBlue
        )}
        )
        </td>
    </tr>
    <tr>
        <td>Final en cuotas:</td>
        <td>
        ${getNumber(montoEnCuotas)} ({getNumber((equivCuotas - 1) * 100)}%
        {sueldo > 0 &&
            ` | ${getNumber(
            (montoEnCuotas / sueldo) * 100
            )}% de mi sueldo, ${getNumber(sueldo / montoEnCuotas)}`}
        )
        </td>
    </tr>
    <tr>
        <td>
        Equiv. en {cuotas} cuota{cuotas > 1 ? "s" : ""}:
        </td>
        <td>
        ${getNumber(equiv1Cuota)} (
        {getNumber((equiv1Cuota / monto - 1) * 100)}%)
        </td>
    </tr>
    <tr>
        <td>Dólar Oficial:</td>
        <td>
        ${getNumber(dolarBase)}{" "}
        {impuesto > 0 && `+${impuesto}% = $${getNumber(dolarOficial)}`} (
        <span title={`$${getNumber(dolarOficial1Y)}`}>
            {getNumber((dolarOficial / dolarOficial1Y - 1) * 100)}% respecto
            año anterior
        </span>
        )
        </td>
    </tr>
    <tr>
        <td>Dólar Blue:</td>
        <td>
        ${getNumber(dolarBlue)} ($
        {getNumber(limite * (dolarBlue - dolarOficial))} ={" "}
        {getNumber((dolarBlue / dolarOficial) * 100 - 100)}% |{" "}
        {getNumber(dolarBlue - dolarBlue1d)}{" "}
        {getNumber((dolarBlue / dolarBlue1d) * 100 - 100)}%)
        </td>
    </tr>
    <tr>
        <td>TEA:</td>
        <td>
        {getNumber(tea * 100)}% (equivale a que el dólar varíe{" "}
        {getNumber(((dolarOficial * (1 + tea)) / dolarBlue) * 100 - 100)}% a
        ${getNumber(dolarOficial * (1 + tea))})
        </td>
    </tr>
    </tbody>
</table>
)};

const CuotasSavingsTable = ({state}) => {
    const { getCoefInteres } = state
    return (
<table className="cuotasSavingsTable">
    <tbody>
    <tr>
        <th>Cuotas</th>
        {/*<th>%</th>*/}
        <th>% Real</th>
    </tr>
    {[1, 3, 6, 9, 10, 12, 15, 18, 24].map((x) => {
        const porc = (1 - getCoefInteres(x) / x) * 100
        return (
            <tr>
                <td>{x}</td>
                {/*<td>{getNumber(porc)}%</td>*/}
                <td>{getNumber(porc*0.9)}%</td>
            </tr>
    )})}
    </tbody>
</table>
)};

function CuotasPage() {
  const [tna, setTna] = useState(91);
  const changeTna = (event) => setTna(parseFloat(event.target.value) || 0)
  const [limite, setLimite] = useState(200);
  const changeLimite = (event) => setLimite(event.target.value ? parseFloat(event.target.value) : null)
  const [impuesto, setImpuesto] = useState(65);
  const changeImpuesto = (event) => setImpuesto(event.target.value ? parseFloat(event.target.value) : null)
  const [sueldo, setSueldo] = useState(0);
  const changeSueldo = (event) => setSueldo(parseFloat(event.target.value || 0))
  const [monto, setMonto] = useState(0);
  const changeMonto = (event) => setMonto(parseFloat(event.target.value))
  const [cuotas, setCuotas] = useState(1);
  const changeCuotas = (event) => setCuotas(parseInt(event.target.value || 1))
  const [tnaTarjeta, setTnaTarjeta] = useState(0);
  const changeTnaTarjeta = (event) => setTnaTarjeta(parseFloat(event.target.value || 0))
  const [dolar, setDolar] = useState([]);

  const date = new Date();
  const hoy =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const hace1Y =
    date.getFullYear() - 1 + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const hace1d = date.getFullYear() +
    "-" + (date.getMonth() + 1) +
    "-" + (date.getDate() - 1);

  const getDolarDia = (type, date) => {
    date = date || hoy;
    let anterior = null;
    const res = dolar.findIndex((v, i) => {
      const res = v.source === type && v.date === date;
      anterior = i;
      if (!res && v.source === type && v.date < date) return true;
      return res;
    });
    return dolar[res]?.date > date ? dolar[anterior] : dolar[res];
  };

  useEffect(() => {
    const getDolar = async () => {
      axios
        .get("https://api.bluelytics.com.ar/v2/evolution.json")
        .then((res) => setDolar(res.data))
        .catch((err) => console.error(err));
    };
    getDolar();
  }, []);

  const tnaToTem = (t) => (t * 30) / 365;
  const temToTna = (t) => (t * 365) / 30;

  const tem = tnaToTem(tna);
  const tea = (1 + tem / 100) ** 12 - 1;
  const temTarjeta = 0; //((1+tnaTarjeta)**(1/12) - 1)*100//tnaToTem(tnaTarjeta)*100
  // CFT = CFTEA = 3.3
  // CFTEM = ((1+CFTEA)^(1/12)-1)*100
  // CFT = CUOTA*n/(monto)-1

  // 3.3*73899-73899*12.924724/9 =
  const cuotaBase = monto / cuotas;
  const getCoefInteres = (n) => {
    let coefInteres = 0;
    for (let i = 1; i <= n; i++) {
      coefInteres += (1 - tem / 100) ** i;
    }
    return coefInteres;
  };
  const coefInteres = getCoefInteres(cuotas);
  const montoEnCuotas = coefInteres * cuotaBase; // C * X / N
  const equivCuotas = montoEnCuotas / monto; // C / N
  const equiv1Cuota = (monto * cuotas) / coefInteres;

  const dolarBase = getDolarDia("Oficial")?.value_sell;
  const dolarOficial = dolarBase * (1 + impuesto / 100);
  const dolarOficial1Y = getDolarDia("Oficial", hace1Y)?.value_sell * (1 + impuesto / 100);
  const dolarBlue = getDolarDia("Blue")?.value_sell;
  const dolarBlue1d = getDolarDia("Blue", hace1d)?.value_sell;

  const miCompraLimite =
    sueldo > limite * dolarOficial ? limite * dolarOficial : sueldo;
  const sueldoUSD =
    (sueldo - miCompraLimite) / dolarBlue + miCompraLimite / dolarOficial;

    const stateGeneral = {
        tna, sueldo, limite, impuesto,
        changeTna, changeSueldo, changeLimite, changeImpuesto
    }
    const stateCuotas = {
        cuotas, monto, tnaTarjeta,
        changeCuotas, changeMonto, changeTnaTarjeta
    }
    const stateFormResults = { sueldo, sueldoUSD, monto, tea, tem, temTarjeta, dolarBlue, montoEnCuotas, equiv1Cuota, equivCuotas, dolarOficial, cuotas, dolarBase, impuesto, dolarOficial1Y, limite, dolarBlue1d }
    const stateSavingsTable = { getCoefInteres }

  return (
    <div style={{ padding: 20 }}>
      <div className="panel config">
        <GeneralForm state={stateGeneral} />
      </div>
      <div class="generalPanel">
        <div className="leftPanel">
          <CuotasForm state={stateCuotas} />
          <hr />
          <CuotasFormResults state={stateFormResults} />
        </div>
        <div className="rightPanel">
            <CuotasSavingsTable state={stateSavingsTable} />
        </div>
      </div>
    </div>
  );
}

export default CuotasPage;
