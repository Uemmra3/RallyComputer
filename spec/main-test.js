describe( "clock(t) のテスト", function(){
	it("3600 = 01:00:00", function(){
		expect(clock(3600)).toBe('010000');
	});
	it("40354= 11:12:34", function(){
		expect(clock(40354)).toBe('111234');
	});
});         //時分秒表示にする//

/*
describe( "addzero(u) のテスト", function(){});         //０をくっつけ６桁化//
describe( "push(button) のテスト", function(){});         //ボタン処理//
describe( " period() のテスト", function(){});         //時刻合わせ及び小数点処理//
describe( " enter() のテスト", function(){});         //エンター処理//
describe( " hanni() のテスト", function(){});         //入力値が正しいか？
describe( " chira(kazu) のテスト", function(){});         //表示切替//
describe( " checkpoint() のテスト", function(){});         //チェック処理
describe( " susumu(keta) のテスト", function(){});         //マップ増加処理
describe( " pathcon() のテスト", function(){});         //パスコン
describe( " trpcl() のテスト", function(){});         //トリップクリア
describe( " cl() のテスト", function(){});         //入力値クリア//
describe( " kirisute (atai, keta) のテスト", function(){});         //小数の桁揃え/////
describe( " about() のテスト", function(){});
describe( " fu(bnum) のテスト", function(){});
*/
