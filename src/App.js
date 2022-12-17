import React from 'react';
import web3 from "./web3";
import contract from './contract';
import sha256 from 'crypto-js/sha256';

document.getElementById("dummy").remove();


function App() {
    return (
        <div>
            <BuyTicket />
            <br/>
            <hr/>
            <PurchaseStatus />
        </div>
    );
}



const BuyTicket = () => {
    const apiurl = "http://127.0.0.1:8000/buyerdb/add"
    const [ studentNumber, setStudentNumber ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const [ date, setDate ] = React.useState("");
    const [ time, setTime ] = React.useState("");
    const [ status, setStatus ] = React.useState({
                                    ErrNumMsg: "",
                                    ErrPassMsg: "",
                                    transactionMsg: ""
                                });

    const onClick = async () => {
        var reg = new RegExp(/^[a-zA-Z0-9]{8}$/); // 半角英数字8文字のみ
        var response = reg.test(studentNumber);
        var reg2 = new RegExp(/^[a-zA-Z0-9]*$/); //　半角英数字のみ
        var response2 = reg2.test(password);


        if (!response) {
            setStatus((status) => ({  ...status, ErrNumMsg: "エラー：学籍番号を正しく入力してください。" }));
        } else {
            setStatus((status) => ({ ...status, ErrNumMsg: "" }));
        }
        if (!response2) {
            setStatus((status) => ({ ...status, ErrPassMsg: "エラー：パスワードを正しく入力してください。" }));
        } else {
            setStatus((status) => ({ ...status, ErrPassMsg: "" }));
        }
        console.log(status.ErrNumMsg)

        console.log(studentNumber.toUpperCase()+password+date+time);
        const userhash =sha256(studentNumber.toUpperCase()+password+date+time).toString();
        console.log(userhash);

        let param = {
            method: 'POST',
            // mode: "no-cors",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "student_id": studentNumber.toUpperCase(), 
                "password": password, 
                "date": date+time
            })
    }

      if (response && response2 && date!="" && time!="") {
        const accounts = await web3.eth.getAccounts();
        setStatus((status) => ({ ...status,  transactionMsg: "購入処理中......しばらくお待ちください......." }));
        await contract.methods.registerBuyer(userhash).send({
          from: accounts[0],
          value: 3000000000000000
        });
        let res = await fetch(apiurl, param);
        console.log(await res.json());
        setStatus((status) => ({ ...status,  transactionMsg: "購入処理完了。" }));
      }
    }

    return (
        <div>
            <h2>定期乗車券を購入する</h2>
            <p>１．乗車する時間を選択してください。</p>

            日時： <input type="date" name="date" onChange={(event) => setDate(event.target.value)}/><br/>
            時間： <input type="time" name="time" onChange={(event) => setTime(event.target.value)}/>
        
            <p>２．学籍番号を<strong>半角英数字</strong>で入力してください。<br/>
            ※空白を入れないでください。<br/>
            学籍番号： <input type="text" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)}/>
            </p>
            
            <p>３．パスワードを<strong>半角英数字</strong>で入力してください。<strong>(任意)</strong><br/>
            <strong>※小文字と大文字は区別されます。</strong><br/>
            ※空白を入れないでください。<br/>
            ※パスワードを設定しない場合は空欄で購入ボタンを押してください。<br/>
            ※パスワードを入力した場合のみ、購入状況が秘匿されます。<br/>
            パスワード： <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </p>

            <button onClick={onClick}>購入</button>
            <br/>
            <br/>
            <h2>{status.transactionMsg}</h2>{status.ErrNumMsg}<br/>
            {status.ErrPassMsg}<br/>
        </div>
    );
}



const PurchaseStatus = () => {
    const apiurl = "http://127.0.0.1:8000/buyerdb/get"
    const [ studentNumber, setStudentNumber ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const [ status, setStatus ] = React.useState({
                                    ErrNumMsg: "",
                                    ErrPassMsg: "",
                                    apiErrMsg: ""
                                });
    let [ datelist, setDatelist ] = React.useState([]);

    const onClick = async () => {
        var reg = new RegExp(/^[a-zA-Z0-9]{8}$/); // 半角英数字8文字のみ
        var response = reg.test(studentNumber);
        var reg2 = new RegExp(/^[a-zA-Z0-9]*$/); //　半角英数字のみ
        var response2 = reg2.test(password);
    
    
        if (!response) {
            setStatus((status) => ({  ...status, ErrNumMsg: "エラー：学籍番号を正しく入力してください。" }));
        } else {
            setStatus((status) => ({ ...status, ErrNumMsg: "" }));
        }
        if (!response2) {
            setStatus((status) => ({ ...status, ErrPassMsg: "エラー：パスワードを正しく入力してください。" }));
        } else {
            setStatus((status) => ({ ...status, ErrPassMsg: "" }));
        }
        console.log(status.ErrNumMsg)
    
        console.log(studentNumber.toUpperCase()+password);
    
        let param = {
            method: 'POST',
            // mode: "no-cors",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "student_id": studentNumber.toUpperCase(), 
                "password": password, 
                "date": ""
                })
        }
    
        if (response && response2 ) {
            setStatus((status) => ({ ...status,  apiErrMsg: "" }));
            let list = await fetch(apiurl, param).catch(e=>{
                setStatus((status) => ({ ...status,  apiErrMsg: "予約済み乗車券が無いか、学籍番号或いはパスワードが間違っています。" }));
            });
            setDatelist(await list.json());
            console.log(datelist);
        }
  
    }

    return (
        <div>
            <h2>購入状況</h2>
            ※<strong>違うパスワードで購入した場合、それぞれのパスワードで照合する必要があります。</strong>
            パスワードを忘れた場合、バス会社にて購入状況をご確認いただけます。<br/>
            ※パスワードを設定しなかった場合は、パスワードを空欄で、照合ボタンを押してください。
            <p>
            学籍番号:   <input type="text" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)}/><br/>
            パスワード: <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/> 
            <button onClick={onClick}>照合</button><br/><br/>
        
            </p>

            <p>・予約状況<br/>
            {datelist.map(item => (<>{item.slice(0,4)}年{item.slice(5,7)}月{item.slice(8,10)}日{item.slice(10,12)}時{item.slice(13,15)}分<br/></>))}
            {status.apiErrMsg}<br/>
            {status.ErrNumMsg}<br/>
            {status.ErrPassMsg}<br/>
            </p>
            
        </div>
    );
}




export default App;