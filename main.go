package main

import (
	"github.com/go-rod/rod"
	"time"
)

func main() {
	page := rod.New().NoDefaultDevice().MustConnect().MustPage("https://www.wikipedia.org/")
	page.MustWindowFullscreen()
	page.MustWaitStable().MustScreenshot("screenshot.png")
	time.Sleep(time.Hour)
}
