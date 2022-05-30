import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, push, set, get, update, remove, serverTimestamp, query, orderByChild, onValue, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STRAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from "./config.js";

const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STRAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

/**
 * 初期処理
 * @return { void }
 * @param { void }
 */
const init = function () {
	screenLoading();
	observeFunc();
	clickEventsFunc();
}

/**
 * 状態監視の処理
 * @return { void }
 * @param { void }
 */
const observeFunc = function () {
	onValue(query(ref(db, "calender/schedules"), orderByChild("start_at")), getSchedule);
	onAuthStateChanged(auth, observeLoginUser);
}

/**
 * クリックイベントの関数
 * @return { void }
 * @param { void }
 */
const clickEventsFunc = function () {
	document.getElementById("add_schedule_btn").addEventListener("click", addSchedule);
	document.getElementById("add_schedule").addEventListener("click", showAddSchedule);
	document.getElementById("edit_schedule_btn").addEventListener("click", editSchedule);
	document.getElementById("update_schedule_btn").addEventListener("click", updateSchedule);
	document.getElementById("delete_schedule_btn").addEventListener("click", deleteSchedule);
	document.getElementById("overlay").addEventListener("click", closeModal);
	document.getElementById("login_btn").addEventListener("click", loginUser);
	document.getElementById("logout_btn").addEventListener("click", logOut);
	document.getElementById("serch_schedule").addEventListener("input", searchSchedule);
	// document.getElementById("upload_csv").addEventListener("change", csv);
	// document.getElementById("register_btn").addEventListener("click", registerUser);
}

/**
 * 日時をタイムスタンプに変換
 * @return { timestamp } 1651585200
 * @param { date } 2020-01-01
 * @param { time } 00:00
 */
const dateToTimestamp = function (d, t) {
	let date = new Date(d + " " + t);
	let timestamp = Math.round(date.getTime() / 1000);
	return timestamp;
}

/**
 * タイムスタンプを日時に変換
 * @return { timestamp } 1651585200
 * @param { array } 20xx, MM/DD, HH:MM, MM, DD, HH, MM
 */
const timeStampToDate = function (timestamp) {
	let date_array = [];
	let date = new Date(timestamp * 1000);
	date_array.push(date.getFullYear()); //20xx
	date_array.push(date.toLocaleDateString().slice(5)); //MM/DD
	date_array.push(date.toLocaleTimeString().slice(0, -3)); //HH:MM
	date_array.push(("0" + (date.getMonth() + 1)).slice(-2)); //MM
	date_array.push(("0" + date.getDate()).slice(-2));//DD
	date_array.push(("0" + date.getHours()).slice(-2));//HH
	date_array.push(("0" + date.getMinutes()).slice(-2));//MM
	return date_array;
}

/**
 * ラジオボタンで選択されたカラーコードを取得
 * @return { Colorcode } #ffffff
 * @param { HtmlElements } elms input[type="radio"]
 */
const getColorCode = function (elms) {
	for (let i = 0; i < elms.length; i++) {
		if (elms[i].checked) {
			return elms[i].value;
		}
	}
}

/**
 * スケジュールを登録
 * @return { void }
 * @param { void }
 */
const addSchedule = function () {
	document.getElementById("error_message").innerText = ""
	const title = document.getElementById("schedule_title").value;
	const place = document.getElementById("schedule_place").value;
	const url = document.getElementById("schedule_url").value;
	const author = document.getElementById("schedule_author").value;
	const description = document.getElementById("schedule_description").value;
	const sd = document.getElementById("schedule_start_date").value;
	const st = document.getElementById("schedule_start_time").value;
	const ed = document.getElementById("schedule_end_date").value;
	const et = document.getElementById("schedule_end_time").value;
	if (title == "" || author == "" || sd == "" || st == "" || ed == "" || et == "" || (dateToTimestamp(sd, st) - dateToTimestamp(ed, et)) > 0) {
		document.getElementById("error_message").innerText = "入力した内容に誤りがあります"
		return false;
	} else {
		document.getElementById("update_schedule_btn").style.display = "none";
		document.getElementById("add_schedule_btn").style.display = "block";
		const dbref = ref(db, "calender/schedules");
		const newPostRef = push(dbref);
		set(newPostRef, {
			title: title,
			start_at: dateToTimestamp(sd, st),
			end_at: dateToTimestamp(ed, et),
			place: place,
			url: url,
			author: author,
			color: getColorCode(document.getElementsByName("color")),
			discription: description,
			create_at: serverTimestamp(),
			update_at: serverTimestamp(),
		});
		document.getElementById("edit_schedule").style.display = "none";
		document.getElementById("overlay").style.display = "none";
		inputScheduleInit();
	}
}

/**
 * スケジュールをDBから取得
 * @return { void }
 * @param { SnapshotObject } snapshot
 */
const getSchedule = function (snapshots) {
	displayScheduleEmpty();
	snapshots.forEach(function (snapshot) {
		let data = snapshot.val();
		displaySchedule(data, snapshot);
	});
}

/**
 * スケジュールを画面表示
 * @return { void }
 * @param { SnapshotObject } data
 * @param { SnapshotObject } snapshot
 */
const displaySchedule = function (data, snapshot) {
	const $ul = document.getElementById("display_schedule_area");
	const $li = document.createElement("li");
	const start_year = timeStampToDate(data.start_at)[0];
	const start_day = timeStampToDate(data.start_at)[1];
	const start_time = timeStampToDate(data.start_at)[2];
	const end_day = timeStampToDate(data.end_at)[1];
	const end_time = timeStampToDate(data.end_at)[2];
	$li.innerHTML = `
		<dl data-schedule_id="${snapshot.key}" data-start_year="${start_year}" data-start_day="${start_day}" style="background-color:${data.color}">
		<dt>${start_day} ${start_time} 〜 ${end_day} ${end_time}<span style="color:${data.color};">${data.author}</span></dt>
		<dd>${data.title}</dd>
		</dl>`;
	$li.children[0].addEventListener("click", showScheduleDetail);
	$ul.appendChild($li);
	insertSectionElement($li);
}

/**
 * 年月の境界線に要素を挿入
 * @return { void }
 * @param { HtmlElement } li
 */
const insertSectionElement = function (li) {
	const now_year = li.children[0].getAttribute('data-start_year');
	const now_month = li.children[0].getAttribute('data-start_day').slice(0, 2).replace("/", "");
	if (li.previousElementSibling == null) {
		li.before(createSectionElement(now_year, now_month), li.firstChild);
	} else {
		const prev_year = li.previousElementSibling.children[0].getAttribute('data-start_year');
		const prev_month = li.previousElementSibling.children[0].getAttribute('data-start_day').slice(0, 1);
		if (now_year !== prev_year || now_month !== prev_month) {
			li.before(createSectionElement(now_year, now_month), li.firstChild);
		} else {
			return false;
		}
	}
};

/**
 * 年月毎の区切り要素を作成
 * @return { HtmlElement } <li class="section">xxxx年x月</li>
 * @param { Date } year YYYY
 * @param { Date } month MM
 */
const createSectionElement = function (year, month) {
	const $li = document.createElement("li");
	$li.setAttribute("class", "section");
	$li.setAttribute("data-start_day", month + "/1");
	$li.innerHTML = `<span>${year}年${month}月</span>`;
	return $li;
}

/**
 * スケジュールの詳細を表示
 * @return { void }
 * @param { void }
 */
const showScheduleDetail = function () {
	document.getElementById("show_schedule").style.display = "block";
	document.getElementById("overlay").style.display = "block";

	get(ref(db, "calender/schedules/" + this.getAttribute("data-schedule_id"))).then(function (snapshot) {
		let data = snapshot.val();
		const start_day = timeStampToDate(data.start_at)[1];
		const start_time = timeStampToDate(data.start_at)[2];
		const end_day = timeStampToDate(data.end_at)[1];
		const end_time = timeStampToDate(data.end_at)[2];

		document.getElementById("show_schedule_title").innerText = data.title;
		document.getElementById("show_schedule_date").innerText = `${start_day} ${start_time} 〜 ${end_day} ${end_time}`;
		document.getElementById("show_schedule_place").innerText = data.place;
		document.getElementById("show_schedule_url").innerHTML = `<a href="${data.url}" target="_blank">${data.url}</a>`;
		document.getElementById("show_schedule_author").innerText = data.author;
		document.getElementById("show_color").style.backgroundColor = data.color;
		document.getElementById("show_schedule_description").innerText = data.discription;
		const $edit_btn = document.getElementById("edit_schedule_btn");
		const $delete_btn = document.getElementById("delete_schedule_btn");
		$edit_btn.setAttribute("data-schedule_id", snapshot.key);
		$delete_btn.setAttribute("data-schedule_id", snapshot.key);
	}).catch(function (e) {
		console.log(e.message, "showScheduleDetailでデータ取得失敗");
	});
}

/**
 * スケジュールを編集を表示
 * @return { void }
 * @param { void }
 */
const editSchedule = function () {
	document.getElementById("show_schedule").style.display = "none";
	document.getElementById("edit_schedule").style.display = "block";
	document.getElementById("add_schedule_btn").style.display = "none";
	document.getElementById("update_schedule_btn").style.display = "block";

	get(ref(db, "calender/schedules/" + this.getAttribute("data-schedule_id"))).then(function (snapshot) {
		let data = snapshot.val();
		const start_year = timeStampToDate(data.start_at)[0];
		const start_month = timeStampToDate(data.start_at)[3];
		const start_day = timeStampToDate(data.start_at)[4];
		const start_hour = timeStampToDate(data.start_at)[5];
		const start_minutes = timeStampToDate(data.start_at)[6];
		const end_year = timeStampToDate(data.end_at)[0];
		const end_month = timeStampToDate(data.start_at)[3];
		const end_day = timeStampToDate(data.start_at)[4];
		const end_hour = timeStampToDate(data.start_at)[5];
		const end_minutes = timeStampToDate(data.start_at)[6];

		document.getElementById("schedule_title").value = data.title;
		document.getElementById("schedule_start_date").value = `${start_year}-${start_month}-${start_day}`;
		document.getElementById("schedule_start_time").value = `${start_hour}:${start_minutes}`;
		document.getElementById("schedule_end_date").value = `${end_year}-${end_month}-${end_day}`;
		document.getElementById("schedule_end_time").value = `${end_hour}:${end_minutes}`;
		document.getElementById("schedule_place").value = data.place;
		document.getElementById("schedule_url").value = data.url;
		document.getElementById("schedule_author").value = data.author;
		document.getElementById("schedule_description").value = data.discription;
		document.getElementsByName("color").forEach(function (e) {
			if (e.value === data.color) { e.checked = true; }
		});
		document.getElementById("update_schedule_btn").setAttribute("data-schedule_id", snapshot.key);
	}).catch(function (e) {
		console.log(e.message, "editScheduleでデータ取得失敗");
	});
}

/**
 * スケジュールを更新
 * @return { void }
 * @param { void }
 */
const updateSchedule = function () {
	let sd = document.getElementById("schedule_start_date").value;
	let st = document.getElementById("schedule_start_time").value;
	let ed = document.getElementById("schedule_end_date").value;
	let et = document.getElementById("schedule_end_time").value;
	update(ref(db, "calender/schedules/" + this.getAttribute("data-schedule_id")), {
		title: document.getElementById("schedule_title").value,
		start_at: dateToTimestamp(sd, st),
		end_at: dateToTimestamp(ed, et),
		place: document.getElementById("schedule_place").value,
		url: document.getElementById("schedule_url").value,
		author: document.getElementById("schedule_author").value,
		color: getColorCode(document.getElementsByName("color")),
		discription: document.getElementById("schedule_description").value,
		update_at: serverTimestamp(),
	});
	document.getElementById("edit_schedule").style.display = "none";
	document.getElementById("overlay").style.display = "none";
}

/**
 * スケジュールを検索
 * @return { void }
 * @param { void }
 */
const searchSchedule = function () {
	const keyword = document.getElementById("serch_schedule").value;
	if (keyword) {
		get(query(ref(db, "calender/schedules"), orderByChild("title"), startAt(keyword), endAt(keyword + '\uf8ff'))).then(function (snapshots) {
			if (snapshots.size == 0) {
				displayScheduleEmpty();
				const $li = document.createElement("li");
				$li.setAttribute("class", "no_schedule");
				$li.innerText = "検索したスケジュールは見つかりませんでした";
				document.getElementById("display_schedule_area").appendChild($li);
			} else {
				getSchedule(snapshots);
			}
		}).catch(function (e) {
			console.log(e.message, "searchScheduleメソッドが失敗しました");
		});
	} else {
		get(query(ref(db, "calender/schedules"), orderByChild("start_at"))).then(function (snapshots) {
			getSchedule(snapshots);
		}).catch(function (e) {
			console.log(e.message, "searchScheduleメソッドが失敗しました");
		});
	}
}

/**
 * スケジュールを削除
 * @return { void }
 * @param { void }
 */
const deleteSchedule = function () {
	console.log(this.getAttribute("data-schedule_id"));
	if (confirm("スケジュールを削除しますか？")) {
		remove(ref(db, "calender/schedules/" + this.getAttribute("data-schedule_id")));
		document.getElementById("show_schedule").style.display = "none";
		document.getElementById("overlay").style.display = "none";
	}
}

/**
 * 表示されているスケジュールを空にする
 * @return { void }
 * @param { void }
 */
const displayScheduleEmpty = function () {
	const $ul = document.getElementById("display_schedule_area");
	while ($ul.firstChild) {
		$ul.removeChild($ul.firstChild);
	}
}

/**
 * 入力中のスケジュール内容を初期に戻す
 * @return { void }
 * @param { void }
 */
const inputScheduleInit = function () {
	document.getElementById("schedule_title").value = "";
	document.getElementById("schedule_start_date").value = "";
	document.getElementById("schedule_start_time").value = "";
	document.getElementById("schedule_end_date").value = "";
	document.getElementById("schedule_end_time").value = "";
	document.getElementById("schedule_place").value = "";
	document.getElementById("schedule_url").value = "";
	document.getElementById("schedule_author").value = "";
	document.getElementsByName("color")[0].checked = true;
	document.getElementById("schedule_description").value = "";
}

/**
 * オープニング画面表示
 * @return { void }
 * @param { void }
 */
const screenLoading = function () {
	if (sessionStorage.getItem("accessed")) {
		document.getElementById("loading_screen").style.display = "none";
	} else {
		sessionStorage.setItem("accessed", "true");
		gsap.to(document.getElementById("loading_screen"), {
			display: "none",
			scale: 1.2,
			opacity: 0,
			ease: "power2.in",
			duration: 0.3,
			delay: 3,
		});
	}
}

/**
 * スケジュール登録・編集画面の表示
 * @return { void }
 * @param { void }
 */
const showAddSchedule = function () {
	document.getElementById("edit_schedule").style.display = "block";
	document.getElementById("overlay").style.display = "block";
}

/**
 * モーダルウィンドウを閉じる
 * @return { void }
 * @param { void }
 */
const closeModal = function () {
	this.style.display = "none";
	document.getElementById("add_schedule_btn").style.display = "block";
	document.getElementById("update_schedule_btn").style.display = "none";
	document.getElementById("edit_schedule").style.display = "none";
	document.getElementById("show_schedule").style.display = "none";
	inputScheduleInit();
}

/**
 * ユーザー登録の処理
 * @return { void }
 * @param { void }
 */
const registerUser = function () {
	const $email = document.getElementById("email");
	const $password = document.getElementById("password");
	const email = $email.value;
	const password = $password.value;
	createUserWithEmailAndPassword(auth, email, password).then(function (userCredential) {
		set(ref(db, "calender/users/" + userCredential.user.uid), {
			email: userCredential.user.email,
		});
		$email.value = "";
		$password.value = "";
	}).catch(() => {
	});
}

/**
 * ログインの処理
 * @return { void }
 * @param { void }
 */
const loginUser = function () {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	signInWithEmailAndPassword(auth, email, password).then(function () {
		document.getElementById("login").style.display = "none";
	}).catch(() => {
		document.getElementById("error_message").style.display = "block";
		document.getElementById("error_message").innerText = "メールアドレス、パスワードに誤りがあります";
	});
}

/**
 * ログアウトの処理
 * @return { void }
 * @param { void }
 */
const logOut = function () {
	if (confirm("ログアウトしますか？")) {
		signOut(auth).then(() => {
			get(ref(db, "calender")).then(function (snapshot) {
				const data = snapshot.val();
				update(ref(db, "calender"), { login_user_count: data.login_user_count - 1 });
				document.getElementById("login_user_count").innerHTML = data.login_user_count;
			}).catch(function (e) {
				console.log(e.message, "showScheduleDetailでデータ取得失敗");
			});
			email.value = "";
			password.value = "";
		}).catch((error) => {
			console.log(error.message, "ログアウトに失敗しました。");
		});;
	}
}

/**
 * ログイン状態の監視
 * @return { void }
 * @param { UserObject } user
 */
const observeLoginUser = function (user) {
	document.getElementById("login").style.display = "none";
	if (user) {
		document.getElementById("login").style.display = "none";
		console.log("ログイン中");
	} else {
		document.getElementById("login").style.display = "flex";
		console.log("ログアウト");
	}
}

init();