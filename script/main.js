

class App {

    #workout_sound
    #pause_sound
    #timer

    #workout_count
    #workout_duration
    #pause_duration

    #state
    #current_set
    #current_time

    #images
    #status

    constructor() {
        this.#workout_sound = new Audio("media/GUI Sound Effects_071.mp3");
        this.#pause_sound = new Audio("media/GUI Sound Effects_072.mp3");
        this.#timer = null;
        this.#state = "stopped";

        this.#status = document.querySelector("#status");

        this.#images = {
            "ready": document.querySelector("#ready"),
            "workout_1": document.querySelector("#workout_1"),
            "workout_2": document.querySelector("#workout_2"),
            "pause_1": document.querySelector("#pause_1"),
            "pause_2": document.querySelector("#pause_2")
        };

    }

    start() {
        if (this.#timer) {
            clearInterval(this.#timer);
        }

        this.#workout_count = parseInt(document.querySelector("#count").value);
        this.#workout_duration = parseInt(document.querySelector("#workout_duration").value);
        this.#pause_duration = parseInt(document.querySelector("#pause_duration").value);

        this.#state = "started";
        this.#current_set = 0;
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

        this.state = "stopped";
        this.#set_image("ready");
        this.#set_status("Bereit");
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

    #on_timer() {
        this.#current_time++;

        switch (this.#state) {
            case "started":
                this.#state = "workout";
                this.#current_set = 1;
                this.#current_time = 0;
                this.#workout_sound.play();
                this.#set_image("workout_1")
                this.#set_status("Training (Satz 1, 0s)");
                break;
            case "workout":
                if (this.#current_time >= this.#workout_duration) {
                    this.#state = "pause";
                    this.#current_time = 0;
                    this.#pause_sound.play();
                    this.#set_image("pause_1");
                    this.#set_status(`Pause (Satz ${this.#current_set + 1}, 0s)`);
                }
                else {
                    this.#set_image(`workout_${1 + (this.#current_time % 2)}`);
                    this.#set_status(`Training (Satz ${this.#current_set}, ${this.#current_time}s)`);
                }
                break;
            case "pause":
                if (this.#current_time >= this.#pause_duration) {
                    this.#current_set++;
                    if (this.#current_set <= this.#workout_count) {
                        this.#current_time = 0;
                        this.#state = "workout";
                        this.#workout_sound.play();
                        this.#set_image("workout_1");
                        this.#set_status(`Training (Satz ${this.#current_set}, 0s)`);
                    }
                    else {
                        this.stop();
                    }
                }
                else {
                    this.#set_image(`pause_${1 + (this.#current_time % 2)}`);
                    this.#set_status(`Pause (Satz ${this.#current_set}, ${this.#current_time}s)`);
                }
                break;
            default:
                this.stop();
        }
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
}

document.addEventListener("DOMContentLoaded", startup);
