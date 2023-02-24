package main

import (
	"embed"
	"github.com/villa01/task-manager/osStats"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type HardWareResponse struct {
	CpuStats  osStats.CPUStats  `json:"cpu_stats"`
	DiskStats osStats.DiskStats `json:"disk_stats"`
}

func getHardwareInfo() HardWareResponse {
	stats := osStats.GetStats()
	return HardWareResponse{
		CpuStats:  stats.CpuStats,
		DiskStats: stats.DiskStats,
	}
}

func main() {
	//Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "OS Monitor",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
