public inherited sharing class ServiceCaseQueueService {
    @AuraEnabled
    public static List<Case> getUserCases() {

        List<Group> queueIdList = [
            SELECT Id 
            FROM Group 
            WHERE Type = 'Queue' 
        ];

        List<Case> userCasesList = [
            SELECT CaseNumber, Owner_Name__c, Origin, Priority, Status, OwnerId
            FROM Case 
            WHERE Status <> 'Closed' 
            ORDER BY OwnerId, Priority ASC, CreatedDate DESC
            LIMIT 25
        ];
        
        return userCasesList;
    }
}