import React from 'react';
import web3 from "./web3";
import contract from './contract';
import sha256 from 'crypto-js/sha256';

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
    const [studentNumber, setStudentNumber] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [statusNum, setStatusNum] = React.useState("");
    const [statusPass, setStatusPass] = React.useState("");

    const [ value, setValue ] = React.useState("");

    const onChangeRadio = (e) => {
      setValue(e.target.value);
    };

    const onClick = async () => {
      var reg = new RegExp(/^[a-zA-Z0-9]{8}$/); // 半角英数字8文字のみ
      var response = reg.test(studentNumber);

      var reg2 = new RegExp(/^[a-zA-Z0-9]*$/); //　半角英数字のみ
      var response2 = reg2.test(password);


      // if (!response) {
      //   setStatusNum("エラー：学籍番号を正しく入力してください。");
      //   setStatusNum(false);
      // } else {
      //   setStatusNum(true);
      // }

      // if (!response2) {
      //   setStatusPass("エラー：パスワードを正しく入力してください。");
      //   setStatusPass(false);
      // } else {
      //   setStatusPass(true);
      // }

      

      console.log(value, studentNumber, password);
      const userhash =sha256(studentNumber+password).toString();
      console.log(userhash);

      
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerFirstBuyer(userhash).send({    //  userhash
        from: accounts[0],
        value: 3000000000000000             // ぴったりに要修正
      });

      }


        
    

    return (
        <div>
            <h2>定期乗車券を購入する</h2>
            <p>１．購入する期間を選択してください</p>
            <br/>

            <div onChange={onChangeRadio}>
                <label><input type="radio" name="options" value="first" /> 前期: 4月～9月   (価格: 0.003 eth)</label>
                <br/>
                <label><input type="radio" name="options" value="second" /> 後期:10月～3月  (価格: 0.003 eth)</label>
                <br/>
                <label><input type="radio" name="options" value="all" /> 1年間:4月～3月  (価格: 0.006 eth)</label>
            </div>
            
            <p>２．学籍番号を<strong>半角英数字</strong>で入力してください。
            <br/>
            ※空白を入れないでください。
            <br/>
            <input type="text" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)}/>
            </p>
            <p>３．パスワードを<strong>半角英数字</strong>で入力してください<strong>(任意)</strong>
            <br/>
            <strong>※小文字と大文字は区別されます。</strong>
            <br/>
            ※空白を入れないでください。
            <br/>
            ※パスワードを設定しない場合は空欄で購入ボタンを押してください。
            <br/>
            ※パスワードを入力した場合のみ、購入状況が秘匿されます。
            <br/>
            <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </p>
            <button onClick={onClick}>購入</button>
            <br/>
            <br/>
            {statusNum}
            <br/>
            {statusPass}
        </div>
    );
}

const PurchaseStatus = () => {
    const [studentNumber, setStudentNumber] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [statusNum, setStatusNum] = React.useState("");
    const [statusPass, setStatusPass] = React.useState("");

    const onClick = () => {

        var reg = new RegExp(/^[a-zA-Z0-9]{8}$/); //上記の正規表現を引数に渡す
        var response = reg.test(studentNumber);
  
        var reg2 = new RegExp(/^[a-zA-Z0-9]*$/); //上記の正規表現を引数に渡す
        var response2 = reg2.test(password);
  
        console.log(response, response2);
  
        if (!response) {
          setStatusNum("エラー：学籍番号を正しく入力してください。");
        } else {
          setStatusNum(true);
        }
  
        if (!response2) {
          setStatusPass("エラー：パスワードを正しく入力してください。");
        } else {
          setStatusPass(true);
        }

    }
    return (
        <div>
            <h2>購入状況</h2>
            ※前期と後期で、違うパスワードで購入した場合、それぞれのパスワードで照合する必要があります。
            パスワードを忘れた場合、バス会社にて購入状況をご確認いただけます。
            <br/>
            ※パスワードを設定しなかった場合は、パスワードを空欄で、照合ボタンを押してください。
            <p>
            学籍番号:   <input type="text" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)}/>
            <br/>
            パスワード: <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/> <button onClick={onClick}>照合</button>
            <br/>
            <br/>
            {statusNum}
            <br/>
            {statusPass}
            </p>
            <p>・購入済み定期乗車券
            <br/>
            前期：
            <br/>
            後期：
            </p>
            
        </div>
    );
}


// const test = async () => {
//   const accounts = await web3.eth.getAccounts();

//   const result = await contract.methods.registerFirstBuyer("b43cb10c0c486a6383325e5dbb9b6b88e7152f0ab12c7ba4ddaa1345c724afa1").send({
//     from: accounts[0],
//     value: 6000000000000000
//   });

//   console.log(result);
// };
// test();

export default App;