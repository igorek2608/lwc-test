/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track, wire, api } from "lwc";
import getUserCases from "@salesforce/apex/ServiceCaseQueueService.getUserCases";
import { subscribe, unsubscribe, onError } from "lightning/empApi";

export default class ServiceCaseQueueFiltered extends LightningElement() {
    cases;
    subscription = {};
    channelName = "/event/Case_Changed__e";
    isLoading = false;

    connectedCallback() {
        this.getUserCasesAll();
        this.handleSubscribe();
        this.registerErrorListener();
    }

    getUserCasesAll() {
        getUserCases()
            .then((result) => {
                this.isLoading = false;
                this.cases = result;
            })
            .catch((error) => {
                that.error = error;
            });
    }

    reloadPage() {
        setTimeout(() => {
            this.isLoading = true;
            this.getUserCasesAll();
        }, 1000);
    }

    handleSubscribe() {
        const thisContext = this;
        const messageCallback = function (response) {
            thisContext.handleEvent(response);
        };

        subscribe(this.channelName, -1, messageCallback)
            .then((response) => {
                thisContext.subscription = response;
                thisContext.handleEvent();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log("Received error from server: ", JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    handleEvent = (response) => {
        setTimeout(() => {
            const that = this;
            if (
                response.data.payload.Action__c == "Update" ||
                response.data.payload.Action__c == "Insert" ||
                response.data.payload.Action__c == "Delete"
            ) {
                this.isLoading = true;
                return that.getUserCasesAll();
            }
        }, 1000);
    };
}
