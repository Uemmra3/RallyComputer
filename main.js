///////////////////////////////////////
//		RALLYCOMPUTER by mra
///////////////////////////////////////
// メンテ履歴
// 20040210 : トリップ処理をIE6用に？
//            OnClick内直接記述からfunction化
//            時計の進め方を調節
//            インデントを調整
///////////////////////////////////////
  power=0;
  tim=st=ave=trp=rc=k=tp=smp=f=map=fn=n=l=m=ent=step=s=s10=d=f2=p=dir=trc=et=ss='';
  ch= new Array(3,0,0,3,0,2,0,3);
  strp= new Array(0,0,0);
//
  function onoff(){         //電源スイッチ//
    if(power > 0){
      //power=0;
    }
    else{
      power=k=dir=1;
      ave=30;
      tim=st=trp=rc=tp=smp=f=map=fn=l=m=ent=step=f2=p=trc=et=ss=0;
      document.NONO.funct.value="0";
      s10=setTimeout("chousei()",6000);
      s=setTimeout("second()",1000);
      //////////
      //document.linkColor="#FFFFFF";
      document.fgColor="#FF9900";
      document.NONO.lt[0].checked=true;
      fu(3);
    }
  }  
//
  function second(){         //時計を進める//
    // 20050210 : 1000 => 1010
    s=setTimeout("second()",1010);
    hyouji();
    /////
    //self.window.focus;
    /////
  }
//
  function chousei(){         //６秒毎の時間調整//
    s10=setTimeout("chousei()",6000);
    clearTimeout(s);
    second();
  }
//
  function hyouji(){         //時刻処理//
    tim++;
    tim%=43200;
    if(m==0){
      d=clock(tim);
      if(step==0 && f2==0){
        document.NONO.funct.value=d;
      }
    }
    if(f2==0){
      if(power>0 && ent!=3){         //ＣＰ処理以外でファイナル更新
        f=st+(3600*trp/ave/1000)-tim+trc;
        f=(f+64800)%43200-21600;
        f=kirisute(f,1);
      }
      document.NONO.finalsc.value=clock(f)+(fn==1?"  ==Fn==":"");
      document.NONO.mapsc.value=map+"      "+"+N-".charAt(1-dir);
    }
    document.NONO.lt[m].checked=true;
    if(step>0){
      ss=setTimeout("tennmetsu()",500);
    }

    if(l==3 && step==0 && f2==0){
      document.NONO.funct.value=trp;
    }
///// for Debug
//    window.status = addzero(tim)+
//                    ":n="+n+
//		    ":ent="+ent+
//		    ":step="+step+
//		    ":"+kirisute(1.2345678,2)+
//		    ":"+(eval("2")+1)+
//		    ":m="+m+
//		    ":f="+f+
//		    //":dir="+dir+
//		    //":map="+map+
//		    //":trp="+trp+
//		    //":type_dir="+typeof(dir)+
//		    //":type_map="+typeof(map)+
//		    //":type_trp="+typeof(trp)+
//		    "";
/////
  }
//
  function tennmetsu(){         //エントリー項目点滅//
    document.NONO.lt[m].checked=false;
    if(ent==3){
      document.NONO.finalsc.value="";
    }
  }
//
  function display(funct,num){         //FUNCT欄に表示する//
    if(power>0){
      funct.value=num;
    }
  }
//
  function clock(t){         //時分秒表示にする//
    // 秒が入っているtを10進数で表示できるように変換
    t= (t*25-(t%3600)*10-(t%60)*6) / 9;
    t=addzero(t);
    return t;
  }
//
  function addzero(u){         //０をくっつけ６桁化//
    v=u;
    for(i=10;i<100000;i*=10){
      v=(u*u<i*i?"0":"")+v;
    }
    v=((u>=0 && u<100000)?"0":"")+v;
    return v;
  }
//
  function push(button){         //ボタン処理//
    if(power>0){
      if(fn==1){
        if(button==1 && ent==3 && step==3){         //オド処理
          ent=2;
          step=4;
          m=6;
          et=1;
          f2=fn=0;
          cl();
          fu(16);
        }
        if(button==2){         //Ｆ２モード切替
          if(f2==0 && step==0){
            f2=1;
            document.NONO.lt[m].checked=false;
            document.NONO.funct.value=strp[0]+"   F2mode";
            document.NONO.finalsc.value=strp[1];
            document.NONO.mapsc.value=strp[2]; 
            fu(17);
          }
          else{
            f2=0;
            document.NONO.lt[m].checked=true;
            display(document.NONO.funct,d);
          }
        }
        if(button==3){         //向き変更
          i=(dir==1?-1:0)+(dir==0?1:0);
          dir=i;
          fu(18);
        }
        if(button==5){         //レスコン
          trc+=rc;
          fu(19);
        }
        if(button==6){         //レスコン
          trc-=rc;
          fu(20);
        }
        if(button==8){         //プラス補正
          if(step==0){
            trp+=tp;
            fu(21);
          }
        }
        if(button==9){         //マイナス補正
          if(step==0){
            trp-=tp;
            fu(22);
          }
        }
        if(button==0 || button==4 || button==7){
          fu(14);
        }
        fn=0;
      }
      else{         //入力処理
        if((power>ch[l] && step==0 && f2==0) || (step>0 && et==1)){
          if(n=="undefined"){//
            n="";//
          }//
          if(n=="0"){
            if(button!=0){
              n=""+button;
            }
          }
          else{
            if(n.length<6){         //////
              n+=""+button;
            }
          }
          ndis=((ent==1 || m==1) ? addzero(n):n);
          if(ent==0){
            ndis=((l==1 || l==4) ? addzero(n):n);
          }
          display(document.NONO.funct,ndis);
        }
      }
    }
  }
//
  function period(){         //時刻合わせ及び小数点処理//
    if(fn==1 && step==0){
      ent=step=1;
      et=1;
      n="";
      p=fn=m=0;
      display(document.NONO.funct,clock(0));
      fu(15);
    }
    else{
      if(p==0 && (m==2 || m==5)){
        p=1;
        n=n+".";
      }
    }
  }
//
  function enter(){         //エンター処理//
    if(n!=""){
      n=eval(n);
    }
    if(ent==1){         //時刻あわせ
      if(n!="" &&(n%100)<60 && (n%10000)<6000 && n<120000){
        clearTimeout(s10);
        s10=setTimeout("chousei()",7000);
        tim=((n%100)*40+(n%10000)*24+n*36)/100-1;
        clearTimeout(s);
        second();
      }
      ent=step=l=m=0;
    }
    if(ent==0 && f2==0){         //通常の入力
      hanni();
    }
    if(ent==2){         //オド
      step--;
      if(n==""){     ///////
      }
      else{
        if(step==3 && n!=0){
          i=strp[0]/n;
          if(i>=.3 || i<=3){
            k=i;
          }
        }
        else{
          hanni();
        }
      }
      m=4-step+(step==1?2:0);
      power=3;   //オド処理までkを入力できない様にする
      if(step==0){
        ent=l=m=0;
        d=clock(tim);
      }
      fu(31-step);
    }
    if(ent==3){         //チェック////////
      step--;
      et=(step==2?1:0);
      m=4-step;
      if(step<=0){
        ent=l=m=0;
        d=clock(tim);
      }
      fu(25-step);
    }
    if(ent==4){         //パスコン////
      step--;
      if(step==1){
        m=2;
        hanni();
        et=0
        m=3;
      }
      if(step==0){
        ent=l=m=0;
        d=clock(tim);
      }
      fu(27-step);
    }
    cl();   //共通掃除
  }
//
  function hanni(){         //入力値が正しいか？
    chr="a"+n;
    if(chr.length>1){  //forNN3
      if(m==1){         //ＳＴ入力
        if((n%100)<60 && (n%10000)<6000 && n<120000){
          st=((n%100)*40+(n%10000)*24+n*36)/100;
          d=clock(st);
        }
      }
      if(m==2){         //アベ入力
        if(n>=5 && n<200){
          ave=d=n;
        }
      }
      if(m==4){         //レスコン入力
        if((n%100)<60 && (n%10000)<6000 && n<20000){      
          rc=((n%100)*40+(n%10000)*24+n*36)/100;
          d=clock(rc);
        }
      }
      if(m==5){         //Ｋ入力
        if(n>.3 && n<3){
          k=d=n;
        }
      }
      if(m==6){        //補正距離入力
        if(n>=0){
          tp=d=n;
        }
      }
    }//
  }
//
  function chira(kazu){         //表示切替//
    num=(l==0?tim:0)
      +(l==1?st:0)
      +(l==2?ave:0)
      +(l==3?trp:0)
      +(l==4?rc:0)
      +(l==5?k:0)
      +(l==6?tp:0)
      +(l==7?smp:0);
    num=((l<2 || l==4)?clock(num):num);
    
    if(m!=l && step==0 && f2==0){         //インジゲーター切り替え
      d=num;
      display(document.NONO.funct,d)
      m=l;
      document.NONO.lt[m].checked=true;
      n="";
      p=fn=0;
      fu(m+4);
    }
    else{
      if(f2==0){
        document.NONO.lt[m].checked=true;
      }
    }
  }
//
  function checkpoint(){         //チェック処理
    ent=step=3;
    st=tim;
    m=1;
    et=0;
    trc=0;
    trpcl();
    cl();
  }
//
  function susumu(keta){         //マップ増加処理
    // 20050210 : for IE6
    map += dir * keta;
    trp += dir * keta;
  }
//
  function pathcon(){         //パスコン
    st+=kirisute(3.6*trp/ave,0);
    st=st%43200;
    ent=4;
    step=2;
    et=1;
    m=2;
    trpcl();
    cl();
  }
//
  function trpcl(){         //トリップクリア
    strp[2]=strp[1];
    strp[1]=strp[0];
    strp[0]=trp;
    trp=0;
    fn=f2=0;
  }
//
  function cl(){         //入力値クリア//
    n="";
    p=fn=0;
    if(ent==0){
      display(document.NONO.funct,d);
      clearTimeout(ss);
      document.NONO.lt[m].checked=true;
    }
    if(ent==1){
      display(document.NONO.funct,"000000");
      fu(13);
    }
    if(ent>=2){
      d=(m==1?clock(st):"")
      +(m==2?ave:"")
      +(m==3?strp[0]:"")
      +(m==5?k:"")
      +(m==6?strp[0]:"");
      display(document.NONO.funct,d);
    }
  }
//
  function kirisute(atai,keta){         //小数の桁揃え/////
    u=atai;
    for(i=0;i<keta;i++){
    u=10*u; 
    }
    u=Math.floor(u);   //-1.1が2になる？
    for(i=0;i<keta;i++){
    u=u/10;
    }
    return u;
  }

  function about(){
    alert("The site of the creator is http://web.kyoto-inet.or.jp/people/t_uemura/");
  }
////////////////////////////////////////
//		使い方表示
////////////////////////////////////////
  ji=new Array(33);
  ji[0]="FINALを忘れずに！メモし、STとチェックカードの値を照合し（間違っていれば修正し）、「ENT」を押す。";
  ji[1]="ＰＣ処理。新しいアベを入れ、「ENTER」を押す。";
  ji[2]="MAPscの値をリセットしました。次のコマ図を読み上げ、余裕ができればSMPに入った値をメモする。";
  ji[3]="電源が入りました！！やったね！";
  ji[4]="タイム。現在時刻。";
  ji[5]="スタートタイム。最近のＰＣでの正解時刻、又はＣＰの入り時刻。";
  ji[6]="アベ。現在の指示速度。";
  ji[7]="トリップ。最近のＰＣ（又はＣＰ）からの距離。";
  ji[8]="レスコン。「F／>」キーと「5／RC+」や「6／RC-」とを組み合わせて使う。";
  ji[9]="補正係数。オドまでのラリー車の距離をオフィシャル計測距離で割ったもの。";
  ji[10]="TRP補正。「F／>」キーと「8／trp+」や「9／trp-」とを組み合わせて使う。";
  ji[11]="ストアマップ。最近のコマ図間の距離が残る。";
  ji[12]="ファンクションキー。続いて数字キーを押すと機能します。";
  ji[13]="入力値等をクリアしました。";
  ji[14]="未実装。";
  ji[15]="時計をあわせましょう。000000～115959の範囲で入力して「ENTER」を押して下さい。";
  ji[16]="オド処理。オフィシャルの計測距離を入れましょう。";
  ji[17]="Ｆ２モード。上から３つ最近のTRPの履歴が表示されています。同じ操作で通常モードに復帰します。";
  ji[18]="距離の増える方向を正、負、ゼロの順に変化させます。ミスコースした時に使います。";
  ji[19]="FINALの値をRCだけ増やしました。";
  ji[20]="FINALの値をRCだけ減らしました。";
  ji[21]="TRPの値をTR-Pだけ増やしました。";
  ji[22]="TRPの値をTR-Pだけ減らしました。";
  ji[23]="ＣＰからの出アベを入れ、「ENTER」を押す。";
  ji[24]="TRPを確認し、「ENTER」を押す。";
  ji[25]="ＣＰ処理終了！";
  ji[26]="TRPを確認し、「ENTER」を押す。";
  ji[27]="ＰＣ処理終了！";
  ji[28]="オドスタート時刻を入力して「ENTER」を押す。";
  ji[29]="オドからの出アベを入れ、「ENTER」を押す。";
  ji[30]="補正係数の値を確認する。";
  ji[31]="オド処理終了！";
  ji[32]="";

  function fu(bnum){
    i=bnum;
    window.status=ji[i];
    window.defaultstatus=ji[i];
  }

