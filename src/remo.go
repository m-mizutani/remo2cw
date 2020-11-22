package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"golang.org/x/xerrors"
)

type remoDevices struct {
	Name         string               `json:"name"`
	ID           string               `json:"id"`
	NewestEvents map[string]remoEvent `json:"newest_events"`
}

type remoEvent struct {
	Val       float64 `json:"val"`
	CreatedAt string  `json:"created_at"`
}

const deviceAPIEndpoint = "https://api.nature.global/1/devices"

func getRemoDevices(apiToken string) ([]*remoDevices, error) {
	req, err := http.NewRequest("GET", deviceAPIEndpoint, nil)
	if err != nil {
		return nil, xerrors.Errorf("Creating a get device request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+apiToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, xerrors.Errorf("Send a get device request: %w", err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, xerrors.Errorf("Reading body of get device request: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("Error response: %s", string(body))
		return nil, xerrors.Errorf("Failed device get request, returned %d", resp.StatusCode)
	}

	var devices []*remoDevices
	if err := json.Unmarshal(body, &devices); err != nil {
		return nil, xerrors.Errorf("Parsing body of get device request: %w", err)
	}

	return devices, nil
}
