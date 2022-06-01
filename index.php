<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8" />
		<title>G's TOKYO LAB13th イベントカレンダー</title>
		<meta name="keywords" content="">
		<meta name="description" content="">
		<meta name="format-detection" content="telephone=no">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="”googlebot”" content="”noindex”" />
		<link rel="stylesheet" href="./css/reset.css" />
		<link rel="stylesheet" href="./css/style.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.min.css">
		<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;500&display=swap" rel="stylesheet" />
	</head>
	<body>
		<main>
			<div id="container">
				<nav id="side_menu">
					<h1>TOKYO LAB13期<br><span>イベントカレンダー</span></h1>
					<ul>
						<li>
							<span id="add_schedule">スケジュール追加</span>
						</li>
						<li>
							<a href="https://12-shiho-lab13.sakura.ne.jp/02_js_assignment/janken_tpl.html" target="_blank">
								<span>ホッと一息</span>
							</a>
						</li>
						<li>
							<span id="logout_btn">ログアウト</span>
						</li>
						<li class="none">
							<span>工事中・・・</span>
						</li>
						<li class="none">
							<span>工事中・・・</span>
						</li>
						<li class="none">
							<span>工事中・・・</span>
						</li>
					</ul>
					<p>
						<input type="text" id="serch_schedule" placeholder="キーワードで検索">
					</p>
					<!-- <p>
						<input type="file" id="upload_csv">
					</p> -->
				</nav>
				<div id="calender">
					<div class="__sec_body__">
						<ul id="display_schedule_area"></ul>
					</div>
				</div>
			</div>
			<div id="edit_schedule">
				<div class="edit_schedule_in">
					<ul>
						<li>
							<dl>
								<dt>タイトル　<span>※必須</span></dt>
								<dd>
									<input type="text" id="schedule_title" class="w100">
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>日時　<span>※必須</span></dt>
								<dd class="date">
									<input type="date" id="schedule_start_date" class="type01">
									<input type="time" id="schedule_start_time" class="type02">〜
									<input type="date" id="schedule_end_date" class="type01">
									<input type="time" id="schedule_end_time" class="type02">
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>場所</dt>
								<dd>
									<input type="text" id="schedule_place" class="w100">
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>URL</dt>
								<dd>
									<input type="url" id="schedule_url" class="w100">
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>作成者　<span>※必須</span></dt>
								<dd>
									<select name="" id="schedule_author">
										<option value="">選択してください</option>
										<option value="01_けんた">01_けんた</option>
										<option value="02_めっし">02_めっし</option>
										<option value="03_ぐっしー">03_ぐっしー</option>
										<option value="04_ヒデ">04_ヒデ</option>
										<option value="05_がんちゃん">05_がんちゃん</option>
										<option value="06_ENOKI">06_ENOKI</option>
										<option value="07_さとる">07_さとる</option>
										<option value="08_たつき">08_たつき</option>
										<option value="09_よしき">09_よしき</option>
										<option value="10_こるり">10_こるり</option>
										<option value="11_アオ">11_アオ</option>
										<option value="12_シホッチ">12_シホッチ</option>
										<option value="13_マッハ">13_マッハ</option>
										<option value="14_こらん">14_こらん</option>
										<option value="15_はやと">15_はやと</option>
										<option value="18_ざわちゃん">18_ざわちゃん</option>
										<option value="19_テリー">19_テリー</option>
										<option value="20_やまとちゃん">20_やまとちゃん</option>
										<option value="21_イッチー">21_イッチー</option>
										<option value="22_ナベさん">22_ナベさん</option>
										<option value="23_ター３">23_ター３</option>
										<option value="担任_かのみ">担任_かのみ</option>
										<option value="副担任_ちぇる">副担任_ちぇる</option>
										<option value="学校長_ウィー先生">学校長_ウィー先生</option>
										<option value="坂尻先生">坂尻先生</option>
										<option value="チューター_しんじ">チューター_しんじ</option>
										<option value="チューター_今村">チューター_今村</option>
										<option value="チューター_いずみ">チューター_いずみ</option>
									</select>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>カラー</dt>
								<dd>
									<label>
										<input type="radio" name="color" value="#34aaff" checked><span></span>
									</label>
									<label>
										<input type="radio" name="color" value="#238b3e"><span class="green"></span>
									</label>
									<label>
										<input type="radio" name="color" value="#ea7a18"><span class="orange"></span>
									</label>
									<label>
										<input type="radio" name="color" value="#ebca24"><span class="yellow"></span>
									</label>
									<label>
										<input type="radio" name="color" value="#eb2222"><span class="red"></span>
									</label>
									<label>
										<input type="radio" name="color" value="#505050"><span class="gray"></span>
									</label>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>説明</dt>
								<dd>
									<textarea id="schedule_description"></textarea>
								</dd>
							</dl>
						</li>
					</ul>
					<p id="error_message"></p>
					<div class="btn_area">
						<button id="add_schedule_btn" class="btn">追加</button>
						<button id="update_schedule_btn" class="btn">更新</button>
					</div>
				</div>
			</div>
			<div id="show_schedule">
				<div class="show_schedule_in">
					<ul>
						<li>
							<dl>
								<dt>
									<span id="show_color"></span>
								</dt>
								<dd>
									<span id="show_schedule_title"></span>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>
									<img src="./images/icon_date.png">
								</dt>
								<dd>
									<span id="show_schedule_date"></span>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>
									<img src="./images/icon_place.png">
								</dt>
								<dd>
									<span id="show_schedule_place"></span>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>
									<img src="./images/icon_url.png">
								</dt>
								<dd>
									<span id="show_schedule_url"></span>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>
									<img src="./images/icon_author.png">
								</dt>
								<dd>
									<span id="show_schedule_author"></span>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>
									<img src="./images/icon_description.png">
								</dt>
								<dd>
									<span id="show_schedule_description"></span>
								</dd>
							</dl>
						</li>
					</ul>
					<div class="btn_area">
						<button id="edit_schedule_btn" class="btn">編集</button>
						<button id="delete_schedule_btn" class="btn">削除</button>
					</div>
				</div>
			</div>
			<div id="login">
				<div class="login_in">
					<p>ー ログイン ー</p>
					<ul>
						<li>
							<dl>
								<dt>メールアドレス</dt>
								<dd>
									<input type="email" name="email" id="email" placeholder="example@gmail.com" />
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>パスワード</dt>
								<dd>
									<input type="password" name="password" id="password" placeholder="" />
									<div id="error_message"></div>
								</dd>
							</dl>
						</li>
					</ul>
					<button id="login_btn">ログイン</button>
				</div>
			</div>
			<div id="overlay"></div>
			<div id="loading_screen">
				<span>G's 第13期 LABコース<br>イベントカレンダー</span>
			</div>
		</main>
		<script src="./js/gsap/gsap.min.js"></script>
		<script src="./js/main.js" type="module"></script>
  </body>
</html>
