use std::thread;
#[tauri::command]
fn get_available_threads() -> usize {
    thread::available_parallelism()
        .map(|threads| threads.get())
        .unwrap_or(1)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_available_threads])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
