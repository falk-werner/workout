

class App {

    #workout_sound
    #breather_sound
    #pause_sound
    #finish_sound

    #timer

    #state

    #images
    #status

    #current_set
    #current_repetition
    #current_time

    #set_count
    #repeat_count
    #training
    #breather
    #pause

    constructor() {
        this.#workout_sound = new Audio("media/GUI Sound Effects_071.mp3");
        this.#breather_sound = new Audio("media/GUI Sound Effects_072.mp3");
        this.#pause_sound = new Audio("media/GUI Sound Effects_079.mp3");
        this.#finish_sound = new Audio("media/GUI Sound Effects_080.mp3");

        this.#timer = null;
        this.#state = "stopped";

        this.#status = document.querySelector("#status");

        this.#images = {
            "ready": document.querySelector("#ready"),
            "workout_1": document.querySelector("#workout_1"),
            "workout_2": document.querySelector("#workout_2"),
            "breather_1": document.querySelector("#breather_1"),
            "breather_2": document.querySelector("#breather_2"),
            "pause_1": document.querySelector("#pause_1"),
            "pause_2": document.querySelector("#pause_2")
        };

    }

    start() {
        if (this.#timer) {
            clearInterval(this.#timer);
        }

        this.#set_count = parseInt(document.querySelector("#set_count").value);
        this.#repeat_count = parseInt(document.querySelector("#repeat_count").value);
        this.#training = parseInt(document.querySelector("#training").value);
        this.#breather = parseInt(document.querySelector("#breather").value);
        this.#pause = parseInt(document.querySelector("#pause").value);

        this.#state = "started";
        this.#current_set = 0;
        this.#current_repetition = 0;
        this.#current_time = 0;

        this.#timer = setInterval(() => {
            this.#on_timer();
        }, 1000);
        document.querySelector("#start").value = "Abbrechen";
    }

    stop() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = null;
        }

        this.#state = "stopped";
        this.#update_ui();
        document.querySelector("#start").value = "Los";
    }

    is_running() {
        return (this.#timer != null);
    }

    #set_status(text) {
        this.#status.textContent = text;
    }

    #set_image(id) {
        for(const [image_id, image] of Object.entries(this.#images)) {
            if (id == image_id) {
                image.classList.remove("hidden");
            }
            else {
                image.classList.add("hidden");
            }
        }
    }

    #update_ui() {
        let status_text = "";
        let image_id = "";

        switch(this.#state) {
            case "workout":
                status_text = `Training (Satz ${this.#current_set}, Wdh. ${this.#current_repetition}, ${this.#current_time}s)`;
                image_id = `workout_${1 + (this.#current_time % 2)}`;
                break;
            case "breather":
                status_text = `Pause (Satz ${this.#current_set}, Wdh. ${this.#current_repetition}, ${this.#current_time}s)`;
                image_id = `breather_${1 + (this.#current_time % 2)}`;
                break;
            case "pause":
                status_text = `Erholung (Satz ${this.#current_set}, Wdh. ${this.#current_repetition}, ${this.#current_time}s)`;
                image_id = `pause_${1 + (this.#current_time % 2)}`;
                break;
            default:
                status_text = "Bereit";
                image_id = "ready";
                break;
        }

        this.#set_status(status_text);
        this.#set_image(image_id);
    }

    #on_timer() {
        this.#current_time++;

        switch (this.#state) {
            case "started":
                this.#state = "workout";
                this.#current_set = 1;
                this.#current_repetition = 1;
                this.#current_time = 0;
                this.#workout_sound.play();
                break;
            case "workout":
                if (this.#current_time >= this.#training) {
                    if (this.#current_repetition >= this.#repeat_count) {
                        if (this.#current_set >= this.#set_count) {
                            this.#state = "ready";
                            this.#finish_sound.play();
                        }
                        else {
                            this.#state = "pause";
                            this.#current_time = 0;
                            this.#breather_sound.play();
                        }
                    }
                    else {
                        this.#state = "breather";
                        this.#current_time = 0;
                        this.#pause_sound.play();
                    }
                }
                break;
            case "breather":
                if (this.#current_time >= this.#breather) {
                    this.#current_repetition++;
                    this.#current_time = 0;
                    this.#state = "workout";
                    this.#workout_sound.play();
                }
                break;
            case "pause":
                if (this.#current_time >= this.#pause) {
                    this.#current_set++;
                    this.#current_repetition = 1;
                    this.#current_time = 0;
                    this.#state = "workout";
                    this.#workout_sound.play();
                }
                break;
            default:
                this.stop();
                break;
        }

        this.#update_ui();
    }

}


function startup() {
    const app = new App();

    const start = document.querySelector("#start");
    start.addEventListener("click", () => {
        if (!app.is_running()) {
            app.start();
        }
        else {
            app.stop();
        }
    });

    document.querySelector("#toggle_settings").addEventListener("click", () => {
        document.querySelector("#settings").classList.toggle("hidden");
    });
}

document.addEventListener("DOMContentLoaded", startup);
