///////////////////////////////////////
//		RALLYCOMPUTER by mra
///////////////////////////////////////
// メンテ履歴
// 20040210 : トリップ処理をIE6用に？
//            OnClick内直接記述からfunction化
//            時計の進め方を調節
//            インデントを調整
///////////////////////////////////////
//"use strict";
// リファクタリング時には、htmlのonClick呼び出しで変数名を指定しているので、合わせて変更すること
var power_ = 0; // 電源状態

// ラリコンが計算に使う各種の値(オブジェクト化すべきなのかも？)
var time_ = ''; // 時刻
var startTime_ = '';    // スタートタイム
var ave_ = '';  // アベ
var trp_ = '';  // トリップ(前のPCやCPからの距離)
var strp_ =  [0, 0, 0]; // トリップ履歴
var resCon_ = '';   // レスコン
var kHosei_ = '';   // K(補正値)
var tp = '';    // 距離補正用
var f = ''; // ファイナル
var trc = '';   // レスコン調整用
var map_ = '';  // map値(コマ図距離計測用)
var smp = '';   // ストアmap(前回のmap)
var tripSensorDir_ = '';  // トリップセンサーの方向

// 操作関連の変数値
var fn = '';    // FN が押されているか？のステータス
var n = ''; // 入力する数値
var p = ''; // ピリオド入力中なのかのステータス
var l = ''; // 現在選択中のファンクション
var targetSelector_ = ''; // 入力対照のファンクション
var enterType_ = '';  // 入力モードの種類　(0: 通常, 1: , 2: オド, 3: CP, 4: PC)
var enterSteps_ = '';   // 入力モードのステップ数
var et_ = '';    // 入力が続くか/値の表示のみかのフラグ？
// タイマー用
var s = '';
var s10 = '';
var ss = '';
var d = '';
var f2Mode_ = '';   // F2モードの切り替え(通常: 0, F2モード: 1)

// 
var ch = [3, 0, 0, 3, 0, 2, 0, 3];

//
function onoff() {         //電源スイッチ//
  if (power_ > 0) {
    //power = 0;
    return;
  }

  power_ = 1;
  kHosei_ = 1;
  tripSensorDir_ = 1;
  ave_ = 30;
  time_ = 0;
  startTime_ = 0;
  trp_ = 0;
  resCon_ = 0;
  tp = 0;
  smp = 0;
  f = 0;
  map_ = 0;
  fn = 0;
  l = 0;
  targetSelector_ = 0;
  enterType_ = 0;
  enterSteps_ = 0;
  f2Mode_ = 0;
  p = 0;
  trc = 0;
  et_ = 0;
  ss = 0;
  document.NONO.funct.value = "0";
  s10 = setTimeout("chousei()", 6000);
  s = setTimeout("second()", 1000);
  //////////
  //document.linkColor = "#FFFFFF";
  document.fgColor = "#FF9900";
  document.NONO.lt[0].checked = true;
  enableGUI();
  fu(3);
}

function enableGUI() {
  var elems = document.NONO.elements;
  for (var i = 0; i < elems.length; i++){
    elems[i].disabled = false;
  }
}
//
function second() {         //時計を進める//
  // 20050210 : 1000  = > 1010
  s = setTimeout("second()", 1010);
  hyouji();
  /////
  //self.window.focus;
  /////
}
//
function chousei() {         //６秒毎の時間調整//
  s10 = setTimeout("chousei()", 6000);
  clearTimeout(s);
  second();
}
//
function hyouji() {         //時刻処理//
  time_++;
  time_ %= 43200;
  if (targetSelector_ == 0) {
    d = clock(time_);
    if (enterSteps_ == 0 && f2Mode_ == 0) {
      document.NONO.funct.value = d;
    }
  }
  if (f2Mode_ == 0) {
    if (power_ > 0 && enterType_ != 3) {         //ＣＰ処理以外でファイナル更新
      f = startTime_ + (3600 * trp_ / ave_ / 1000) - time_ + trc;
      f = (f + 64800) % 43200 - 21600;
      f = kirisute(f, 1);
    }
    document.NONO.finalsc.value = clock(f) + (fn == 1 ? "   == Fn == " : "");
    document.NONO.mapsc.value = map_ + "      " + "+N-".charAt(1 - tripSensorDir_);
  }
  document.NONO.lt[targetSelector_].checked = true;
  if (enterSteps_ > 0) {
    ss = setTimeout("tennmetsu()", 500);
  }

  if (l == 3 && enterSteps_ == 0 && f2Mode_ == 0) {
    document.NONO.funct.value = trp_;
  }
///// for Debug
//    window.status  =  addzero(tim)+
//                    ":n = "+n+
//		    ":ent = "+ent+
//		    ":step = "+step+
//		    ":"+kirisute(1.2345678, 2)+
//		    ":"+(eval("2")+1)+
//		    ":m = "+m+
//		    ":f = "+f+
//		    //":dir = "+dir+
//		    //":map = "+map+
//		    //":trp = "+trp+
//		    //":type_dir = "+typeof(dir)+
//		    //":type_map = "+typeof(map)+
//		    //":type_trp = "+typeof(trp)+
//		    "";
/////
}
//
function tennmetsu() {         //エントリー項目点滅//
  document.NONO.lt[targetSelector_].checked = false;
  if (enterType_ == 3) {
    document.NONO.finalsc.value = "";
  }
}
//
function display(funct, num) {         //FUNCT欄に表示する//
  if (power_ > 0) {
    funct.value = num;
  }
}
//
function clock(t) {         //時分秒表示にする//
  // 秒が入っているtを10進数で表示できるように変換
  t =  (t * 25 - (t % 3600) * 10 - (t % 60) * 6) / 9;
  t = addzero(t);
  return t;
}
//
function addzero(u) {         //０をくっつけ６桁化//
  var v = u;
  for (var i = 10; i < 100000; i *= 10) {
    v = (u * u < i * i ? "0" : "") + v;
  }
  v = ((u >= 0 && u < 100000) ? "0" : "") + v;
  return v;
}
//
function push(button) {         //ボタン処理//
  if (power_ <= 0) {
    return;
  }

  if (fn == 1) {
    if (button == 1 && enterType_ == 3 && enterSteps_ == 3) {         //オド処理
      enterType_ = 2;
      enterSteps_ = 4;
      targetSelector_ = 6;
      et_ = 1;
      f2Mode_ = 0;
      fn = 0;
      cl();
      fu(16);
    }
    if (button == 2) {         //Ｆ２モード切替
      if (f2Mode_ == 0 && enterSteps_ == 0) {
        f2Mode_ = 1;
        document.NONO.lt[targetSelector_].checked = false;
        document.NONO.funct.value = strp_[0] + "   F2mode";
        document.NONO.finalsc.value = strp_[1];
        document.NONO.mapsc.value = strp_[2];
        fu(17);
      } else {
        f2Mode_ = 0;
        document.NONO.lt[targetSelector_].checked = true;
        display(document.NONO.funct, d);
      }
    }
    if (button == 3) {         //向き変更
      var i = (tripSensorDir_ == 1 ? -1 : 0) + (tripSensorDir_ == 0 ? 1 : 0);
      tripSensorDir_ = i;
      fu(18);
    }
    if (button == 5) {         //レスコン
      trc += resCon_;
      fu(19);
    }
    if (button == 6) {         //レスコン
      trc -= resCon_;
      fu(20);
    }
    if (button == 8) {         //プラス補正
      if (enterSteps_ == 0) {
        trp_ += tp;
        fu(21);
      }
    }
    if (button == 9) {         //マイナス補正
      if (enterSteps_ == 0) {
        trp_ -= tp;
        fu(22);
      }
    }
    if (button == 0 || button == 4 || button == 7) {
      fu(14);
    }
    fn = 0;
  } else {         //入力処理
    if ((power_ > ch[l] && enterSteps_ == 0 && f2Mode_ == 0)
        || (enterSteps_ > 0 && et_ == 1)) {
      if (n == "undefined") {//
        n = "";//
      }//
      if (n == "0") {
        if (button != 0) {
          n = "" + button;
        }
      } else {
        if (n.length < 6) {         //////
          n += "" + button;
        }
      }
      var ndis = ((enterType_ == 1 || targetSelector_ == 1) ? addzero(n) : n);
      if (enterType_ == 0) {
        ndis = ((l == 1 || l == 4) ? addzero(n) : n);
      }
      display(document.NONO.funct, ndis);
    }
  }

}
//
function period() {         //時刻合わせ及び小数点処理//
  if (fn == 1 && enterSteps_ == 0) {
    enterType_ = enterSteps_ = 1;
    et_ = 1;
    n = "";
    p = 0;
    fn = 0;
    targetSelector_ = 0;
    display(document.NONO.funct, clock(0));
    fu(15);
  } else {
    if (p == 0 && (targetSelector_ == 2 || targetSelector_ == 5)) {
      p = 1;
      n = n  + ".";
    }
  }
}
//
function enter() {         //エンター処理//
  if (n != "") {
    n = eval(n);
  }
  if (enterType_ == 1) {         //時刻あわせ
    if (n != "" && (n%100) < 60 && (n % 10000) < 6000 && n < 120000) {
      clearTimeout(s10);
      s10 = setTimeout("chousei()", 7000);
      time_ = ((n % 100) * 40 + (n % 10000) * 24 + n * 36) / 100 - 1;
      clearTimeout(s);
      second();
    }
    enterType_ = enterSteps_ = l = targetSelector_ = 0;
  }
  if (enterType_ == 0 && f2Mode_ == 0) {         //通常の入力
    hanni();
  }
  if (enterType_ == 2) {         //オド
    enterSteps_--;
    if (n == "") {     ///////
    } else {
      if (enterSteps_ == 3 && n != 0) {
        var i = strp_[0] / n;
        if (i >= .3 || i <= 3) {
          kHosei_ = i;
        }
      } else {
        hanni();
      }
    }
    targetSelector_ = 4 - enterSteps_ + (enterSteps_ == 1 ? 2 : 0);
    power_ = 3;   //オド処理までkを入力できない様にする
    if (enterSteps_ == 0) {
      enterType_ = l = targetSelector_ = 0;
      d = clock(time_);
    }
    fu(31 - enterSteps_);
  }
  if (enterType_ == 3) {         //チェック////////
    enterSteps_--;
    et_ = (enterSteps_ == 2 ? 1 : 0);
    targetSelector_ = 4 - enterSteps_;
    if (enterSteps_ <= 0) {
      enterType_ = l = targetSelector_ = 0;
      d = clock(time_);
    }
    fu(25 - enterSteps_);
  }
  if (enterType_ == 4) {         //パスコン////
    enterSteps_--;
    if (enterSteps_ == 1) {
      targetSelector_ = 2;
      hanni();
      et_ = 0
      targetSelector_ = 3;
    }
    if (enterSteps_ == 0) {
      enterType_ = l = targetSelector_ = 0;
      d = clock(time_);
    }
    fu(27 - enterSteps_);
  }
  cl();   //共通掃除
}
//
function hanni() {         //入力値が正しいか？
  var chr = "a" + n;
  if (chr.length > 1) {  //forNN3
    if (targetSelector_ == 1) {         //ＳＴ入力
      if ((n % 100) < 60 && (n % 10000) < 6000 && n < 120000) {
        startTime_ = ((n % 100) * 40 + (n % 10000) * 24 + n * 36) / 100;
        d = clock(startTime_);
      }
    }
    if (targetSelector_ == 2) {         //アベ入力
      if (n >= 5 && n < 200) {
        ave_ = d = n;
      }
    }
    if (targetSelector_ == 4) {         //レスコン入力
      if ((n % 100) < 60 && (n % 10000) < 6000 && n < 20000) {      
        resCon_ = ((n % 100) * 40 + (n % 10000) * 24 + n * 36) / 100;
        d = clock(resCon_);
      }
    }
    if (targetSelector_ == 5) {         //Ｋ入力
      if (n > .3 && n < 3) {
        kHosei_ = d = n;
      }
    }
    if (targetSelector_ == 6) {        //補正距離入力
      if (n >= 0) {
        tp = d = n;
      }
    }
  }//
}
//
function chira(kazu) {         //表示切替//
  var num = (l == 0 ? time_ : 0)
    + (l == 1 ? startTime_ : 0)
    + (l == 2 ? ave_ : 0)
    + (l == 3 ? trp_ : 0)
    + (l == 4 ? resCon_ : 0)
    + (l == 5 ? kHosei_ : 0)
    + (l == 6 ? tp : 0)
    + (l == 7 ? smp : 0);
  num = (l < 2 || l == 4) ? clock(num) : num;
  
  if (targetSelector_ != l && enterSteps_ == 0 && f2Mode_ == 0) {         //インジゲーター切り替え
    d = num;
    display(document.NONO.funct, d)
    targetSelector_ = l;
    document.NONO.lt[targetSelector_].checked = true;
    n = "";
    p = 0;
    fn = 0;
    fu(targetSelector_ + 4);
  } else {
    if (f2Mode_ == 0) {
      document.NONO.lt[targetSelector_].checked = true;
    }
  }
}
//
function checkpoint() {         //チェック処理
  enterType_ = enterSteps_ = 3;
  startTime_ = time_;
  targetSelector_ = 1;
  et_ = 0;
  trc = 0;
  trpcl();
  cl();
}
//
function susumu(keta) {         //マップ増加処理
  // 20050210 : for IE6
  map_ +=  tripSensorDir_ * keta;
  trp_ +=  tripSensorDir_ * keta;
}
//
function pathcon() {         //パスコン
  startTime_ += kirisute(3.6 * trp_ / ave_, 0);
  startTime_ = startTime_ % 43200;
  enterType_ = 4;
  enterSteps_ = 2;
  et_ = 1;
  targetSelector_ = 2;
  trpcl();
  cl();
}
//
function trpcl() {         //トリップクリア
  strp_[2] = strp_[1];
  strp_[1] = strp_[0];
  strp_[0] = trp_;
  trp_ = 0;
  fn = 0;
  f2Mode_ = 0;
}
//
function cl() {         //入力値クリア//
  n = "";
  p = 0;
  fn = 0;
  if (enterType_ == 0) {
    display(document.NONO.funct, d);
    clearTimeout(ss);
    document.NONO.lt[targetSelector_].checked = true;
  }
  if (enterType_ == 1) {
    display(document.NONO.funct, "000000");
    fu(13);
  }
  if (enterType_ >= 2) {
    d = (targetSelector_ == 1 ? clock(startTime_) : "")
    + (targetSelector_ == 2 ? ave_ : "")
    + (targetSelector_ == 3 ? strp_[0] : "")
    + (targetSelector_ == 5 ? kHosei_ : "")
    + (targetSelector_ == 6 ? strp_[0] : "");
    display(document.NONO.funct, d);
  }
}
//
function kirisute (atai, keta) {         //小数の桁揃え/////
  var u = atai;
  for (var i = 0; i < keta; i++) {
  u = 10 * u;
  }
  u = Math.floor(u);   //-1.1が2になる？
  for (i = 0; i < keta; i++) {
  u = u / 10;
  }
  return u;
}

function about() {
  alert("The site of the creator is http://web.kyoto-inet.or.jp/people/t_uemura/");
}
////////////////////////////////////////
//		使い方表示
////////////////////////////////////////
var ji = new Array(33);
ji[0] = "FINALを忘れずに！メモし、STとチェックカードの値を照合し（間違っていれば修正し）、「ENT」を押す。";
ji[1] = "ＰＣ処理。新しいアベを入れ、「ENT」を押す。";
ji[2] = "MAPscの値をリセットしました。次のコマ図を読み上げ、余裕ができればSMPに入った値をメモする。";
ji[3] = "電源が入りました！！やったね！";
ji[4] = "タイム。現在時刻。";
ji[5] = "スタートタイム。最近のＰＣでの正解時刻、又はＣＰの入り時刻。";
ji[6] = "アベ。現在の指示速度。";
ji[7] = "トリップ。最近のＰＣ（又はＣＰ）からの距離。";
ji[8] = "レスコン。「F／>」キーと「5／RC+」や「6／RC-」とを組み合わせて使う。";
ji[9] = "補正係数。オドまでのラリー車の距離をオフィシャル計測距離で割ったもの。";
ji[10] = "TRP補正。「F／>」キーと「8／trp+」や「9／trp-」とを組み合わせて使う。";
ji[11] = "ストアマップ。最近のコマ図間の距離が残る。";
ji[12] = "ファンクションキー。続いて数字キーを押すと機能します。";
ji[13] = "入力値等をクリアしました。";
ji[14] = "未実装。";
ji[15] = "時計をあわせましょう。000000～115959の範囲で入力して「ENT」を押して下さい。";
ji[16] = "オド処理。オフィシャルの計測距離を入れましょう。";
ji[17] = "Ｆ２モード。上から３つ最近のTRPの履歴が表示されています。同じ操作で通常モードに復帰します。";
ji[18] = "距離の増える方向を正、負、ゼロの順に変化させます。ミスコースした時に使います。";
ji[19] = "FINALの値をRCだけ増やしました。";
ji[20] = "FINALの値をRCだけ減らしました。";
ji[21] = "TRPの値をTR-Pだけ増やしました。";
ji[22] = "TRPの値をTR-Pだけ減らしました。";
ji[23] = "ＣＰからの出アベを入れ、「ENT」を押す。";
ji[24] = "TRPを確認し、「ENT」を押す。";
ji[25] = "ＣＰ処理終了！";
ji[26] = "TRPを確認し、「ENT」を押す。";
ji[27] = "ＰＣ処理終了！";
ji[28] = "オドスタート時刻を入力して「ENT」を押す。";
ji[29] = "オドからの出アベを入れ、「ENT」を押す。";
ji[30] = "補正係数の値を確認する。";
ji[31] = "オド処理終了！";
ji[32] = "";

function fu(bnum) {
  //i = bnum;
  //window.status = ji[i];
  // window.defaultstatus = ji[i];
  document.getElementById("status-box").textContent = ji[bnum];
}

