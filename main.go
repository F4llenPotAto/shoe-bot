package main

import (
	"github.com/go-rod/rod"
	"time"
)

func main() {
	browser := rod.New().MustConnect().NoDefaultDevice()
	page := browser.MustPage("https://wikipedia.org/").MustWindowFullscreen()

	page.MustElement("#searchInput").MustInput("earth")

	page.MustWaitStable().MustScreenshot("screenshot.png")
	time.Sleep(time.Hour)
}
